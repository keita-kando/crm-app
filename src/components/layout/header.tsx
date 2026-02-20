import { Building2 } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-white px-6">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Building2 className="h-5 w-5" />
        <span className="text-sm">CRM システム</span>
      </div>
    </header>
  );
}
