import { CustomerEntryWrapper } from "@/app/customer-entry-wrapper";
import { CustomerMenuPage } from "@/features/menu/components/customer-menu-page";

export default function HomePage() {
  return (
    <CustomerEntryWrapper>
      <CustomerMenuPage />
    </CustomerEntryWrapper>
  );
}
