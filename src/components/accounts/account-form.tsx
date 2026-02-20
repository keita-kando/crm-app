"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { accountSchema, type AccountFormValues } from "@/lib/validations";
import { INDUSTRY_OPTIONS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface AccountFormProps {
  defaultValues?: AccountFormValues;
  accountId?: string;
}

export function AccountForm({ defaultValues, accountId }: AccountFormProps) {
  const router = useRouter();
  const isEdit = !!accountId;

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultValues || { name: "" },
  });

  const onSubmit = async (data: AccountFormValues) => {
    const url = isEdit ? `/api/accounts/${accountId}` : "/api/accounts";
    const method = isEdit ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const account = await res.json();
      router.push(`/accounts/${account.id}`);
      router.refresh();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">取引先名 *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">業種</Label>
              <Select value={watch("industry") || ""} onValueChange={(v) => setValue("industry", v)}>
                <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">電話番号</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Webサイト</Label>
              <Input id="website" {...register("website")} />
              {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="annualRevenue">年間売上</Label>
              <Input id="annualRevenue" type="number" {...register("annualRevenue", { valueAsNumber: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">従業員数</Label>
              <Input id="employees" type="number" {...register("employees", { valueAsNumber: true })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">住所</Label>
            <Input id="address" {...register("address")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">説明</Label>
            <Textarea id="description" rows={3} {...register("description")} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "保存中..." : isEdit ? "更新" : "作成"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>キャンセル</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
