"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { DEAL_STAGES } from "@/lib/constants";
import { DealCard } from "@/components/deals/deal-card";

interface Deal {
  id: string;
  name: string;
  amount: number | null;
  stage: string;
  probability: number;
  closeDate: Date | null;
  account: { name: string } | null;
  contact: { firstName: string; lastName: string } | null;
}

export function PipelineBoard({ deals: initialDeals }: { deals: Deal[] }) {
  const router = useRouter();
  const [deals, setDeals] = useState(initialDeals);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const dealId = result.draggableId;
    const newStage = result.destination.droppableId;

    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );

    await fetch(`/api/deals/${dealId}/stage`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: newStage }),
    });

    router.refresh();
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-3 overflow-x-auto pb-4">
        {DEAL_STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.value);
          const stageTotal = stageDeals.reduce(
            (sum, d) => sum + (d.amount || 0),
            0
          );
          return (
            <div key={stage.value} className="flex-shrink-0 w-64">
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${stage.color}`}
                  />
                  <span className="text-sm font-medium">{stage.label}</span>
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                    {stageDeals.length}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-2 px-1">
                {stageTotal > 0 ? `¥${stageTotal.toLocaleString()}` : "---"}
              </p>
              <Droppable droppableId={stage.value}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[200px] rounded-lg border-2 border-dashed p-2 space-y-2 transition-colors ${
                      snapshot.isDraggingOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-transparent bg-muted/30"
                    }`}
                  >
                    {stageDeals.map((deal, index) => (
                      <Draggable
                        key={deal.id}
                        draggableId={deal.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={
                              snapshot.isDragging ? "opacity-90" : ""
                            }
                          >
                            <DealCard deal={deal} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
}
