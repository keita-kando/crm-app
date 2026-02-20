"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormValues } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface ContactFormProps {
  defaultValues?: ContactFormValues;
  contactId?: string;
  accounts: { id: string; name: string }[];
}

export function ContactForm({ defaultValues, contactId, accounts }: ContactFormProps) {
  const router = useRouter();
  const isEdit = !!contactId;

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: defaultValues || { firstName: "", lastName: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    const url = isEdit ? `/api/contacts/${contactId}` : "/api/contacts";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    if (res.ok) {
      const contact = await res.json();
      router.push(`/contacts/${contact.id}`);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lastName">姓 *</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="firstName">名 *</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">メール</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">役職</Label>
              <Input id="title" {...register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">部署</Label>
              <Input id="department" {...register("department")} />
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
