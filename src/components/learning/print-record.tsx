"use client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
export function PrintRecord() {
  return (
    <Button
      variant="outline"
      onClick={() => window.print()}
      className="print:hidden"
    >
      <Printer size={16} aria-hidden="true" />
      Print / Save PDF
    </Button>
  );
}
