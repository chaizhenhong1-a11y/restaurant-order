"use client";

import { CustomerEntryShell } from "@/features/customer/entry/components/customer-entry-shell";

type Props = {
  children: React.ReactNode;
};

export function CustomerEntryWrapper({ children }: Props) {
  return <CustomerEntryShell>{children}</CustomerEntryShell>;
}
