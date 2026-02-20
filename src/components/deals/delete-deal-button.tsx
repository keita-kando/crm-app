"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export function DeleteDealButton({ dealId }: { dealId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/deals/${dealId}`, { method: "DELETE" });
    if (res.ok) { router.push("/deals"); router.refresh(); }
    setDeleting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive"><Trash2 className="mr-2 h-4 w-4" />削除</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>商談の削除</DialogTitle>
          <DialogDescription>この商談を削除してもよろしいですか？</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? "削除中..." : "削除"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
