import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function DataTable({
  title,
  description,
  headers,
  rows,
  empty,
}: {
  title: string;
  description: string;
  headers: string[];
  rows: ReactNode[][];
  empty: string;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-5">
        <h2 className="font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-muted text-xs uppercase text-muted-foreground">
              <tr>{headers.map((header) => <th key={header} className="px-4 py-3 font-medium">{header}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border">
                  {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="p-5 text-sm text-muted-foreground">{empty}</p>
      )}
    </Card>
  );
}
