"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { activitySchema, type ActivityFormValues } from "@/lib/validations";
import { ACTIVITY_TYPES, PRIORITY_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

interface ActivityFormDialogProps {
  accounts: { id: string; name: string }[];
  contacts: { id: string; firstName: string; lastName: string }[];
  deals: { id: string; name: string }[];
}

export function ActivityFormDialog({ accounts, contacts, deals }: ActivityFormDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors, isSubmitting },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: { type: "電話", subject: "", priority: "中", completed: false },
  });

  const onSubmit = async (data: ActivityFormValues) => {
    const res = await fetch("/api/activities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setOpen(false);
      reset();
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button><Plus className="mr-2 h-4 w-4" />新規作成</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>活動の記録</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>種別 *</Label>
              <Select value={watch("type")} onValueChange={(v) => setValue("type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>優先度</Label>
              <Select value={watch("priority")} onValueChange={(v) => setValue("priority", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITY_OPTIONS.map((p) => (<SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>件名 *</Label>
            <Input {...register("subject")} />
            {errors.subject && <p className="text-sm text-red-500">{errors.subject.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>内容</Label>
            <Textarea rows={3} {...register("description")} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>期限</Label>
              <Input type="date" {...register("dueDate")} />
            </div>
            <div className="space-y-2">
              <Label>取引先</Label>
              <Select value={watch("accountId") || ""} onValueChange={(v) => setValue("accountId", v)}>
                <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (<SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>担当者</Label>
              <Select value={watch("contactId") || ""} onValueChange={(v) => setValue("contactId", v)}>
                <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                <SelectContent>
                  {contacts.map((c) => (<SelectItem key={c.id} value={c.id}>{c.lastName} {c.firstName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>商談</Label>
              <Select value={watch("dealId") || ""} onValueChange={(v) => setValue("dealId", v)}>
                <SelectTrigger><SelectValue placeholder="選択" /></SelectTrigger>
                <SelectContent>
                  {deals.map((d) => (<SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>キャンセル</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "保存中..." : "保存"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
