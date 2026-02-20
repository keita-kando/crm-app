"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { dealSchema, type DealFormValues } from "@/lib/validations";
import { DEAL_STAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface DealFormProps {
  defaultValues?: DealFormValues;
  dealId?: string;
  accounts: { id: string; name: string }[];
  contacts: { id: string; firstName: string; lastName: string; accountId: string | null }[];
}

export function DealForm({ defaultValues, dealId, accounts, contacts }: DealFormProps) {
  const router = useRouter();
  const isEdit = !!dealId;

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: defaultValues || { name: "", stage: "リード", probability: 10 },
  });

  const selectedAccountId = watch("accountId");
  const filteredContacts = selectedAccountId
    ? contacts.filter((c) => c.accountId === selectedAccountId)
    : contacts;

  const onSubmit = async (data: DealFormValues) => {
    const url = isEdit ? `/api/deals/${dealId}` : "/api/deals";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const deal = await res.json();
      router.push(`/deals/${deal.id}`);
      router.refresh();
    }
  };

  const handleStageChange = (stage: string) => {
    setValue("stage", stage);
    const stageInfo = DEAL_STAGES.find((s) => s.value === stage);
    if (stageInfo) setValue("probability", stageInfo.probability);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">商談名 *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">金額 (円)</Label>
              <Input id="amount" type="number" {...register("amount", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stage">ステージ *</Label>
              <Select value={watch("stage")} onValueChange={handleStageChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEAL_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.color}`} />
                        {s.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="probability">確度 (%)</Label>
              <Input id="probability" type="number" min={0} max={100} {...register("probability", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeDate">完了予定日</Label>
              <Input id="closeDate" type="date" {...register("closeDate")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountId">取引先</Label>
              <Select value={watch("accountId") || ""} onValueChange={(v) => setValue("accountId", v)}>
                <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactId">担当者</Label>
              <Select value={watch("contactId") || ""} onValueChange={(v) => setValue("contactId", v)}>
                <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {filteredContacts.map((c) => (<SelectItem key={c.id} value={c.id}>{c.lastName} {c.firstName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "保存中..." : isEdit ? "更新" : "作成"}</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>キャンセル</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
