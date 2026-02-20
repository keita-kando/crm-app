import { PageHeader } from "@/components/layout/page-header";
import { AccountForm } from "@/components/accounts/account-form";

export default function NewAccountPage() {
  return (
    <div>
      <PageHeader title="取引先の新規作成" />
      <AccountForm />
    </div>
  );
}
