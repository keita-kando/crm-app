"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  department: string | null;
  account: { id: string; name: string } | null;
}

export function ContactTable({ contacts }: { contacts: Contact[] }) {
  const [search, setSearch] = useState("");

  const filtered = contacts.filter((c) => {
    const fullName = `${c.lastName} ${c.firstName}`;
    const q = search.toLowerCase();
    return fullName.toLowerCase().includes(q) || (c.email?.toLowerCase().includes(q) ?? false);
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="名前またはメールで検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>役職</TableHead>
              <TableHead>部署</TableHead>
              <TableHead>メール</TableHead>
              <TableHead>電話番号</TableHead>
              <TableHead>取引先</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">担当者が見つかりません</TableCell>
              </TableRow>
            ) : (
              filtered.map((contact) => (
                <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <Link href={`/contacts/${contact.id}`} className="font-medium text-blue-600 hover:underline">
                      {contact.lastName} {contact.firstName}
                    </Link>
                  </TableCell>
                  <TableCell>{contact.title || "---"}</TableCell>
                  <TableCell>{contact.department || "---"}</TableCell>
                  <TableCell>{contact.email || "---"}</TableCell>
                  <TableCell>{contact.phone || "---"}</TableCell>
                  <TableCell>
                    {contact.account ? (
                      <Link href={`/accounts/${contact.account.id}`} className="text-blue-600 hover:underline">{contact.account.name}</Link>
                    ) : "---"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
