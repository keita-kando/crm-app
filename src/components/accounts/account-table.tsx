"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { formatCurrency } from "@/lib/format";

interface Account {
  id: string;
  name: string;
  industry: string | null;
  phone: string | null;
  annualRevenue: number | null;
  _count: { contacts: number; deals: number };
}

export function AccountTable({ accounts }: { accounts: Account[] }) {
  const [search, setSearch] = useState("");

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="取引先名で検索..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>取引先名</TableHead>
              <TableHead>業種</TableHead>
              <TableHead>電話番号</TableHead>
              <TableHead className="text-right">年間売上</TableHead>
              <TableHead className="text-center">担当者数</TableHead>
              <TableHead className="text-center">商談数</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  取引先が見つかりません
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((account) => (
                <TableRow key={account.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/accounts/${account.id}`} className="font-medium text-blue-600 hover:underline">
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {account.industry ? <Badge variant="secondary">{account.industry}</Badge> : "---"}
                  </TableCell>
                  <TableCell>{account.phone || "---"}</TableCell>
                  <TableCell className="text-right">{formatCurrency(account.annualRevenue)}</TableCell>
                  <TableCell className="text-center">{account._count.contacts}</TableCell>
                  <TableCell className="text-center">{account._count.deals}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
