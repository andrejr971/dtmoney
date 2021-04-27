import { ReactNode } from "react";
import { TransactionProvider } from "./transactions";

interface AppProviderData {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderData) {
  return (
    <TransactionProvider>
      {children}
    </TransactionProvider>
  )
}