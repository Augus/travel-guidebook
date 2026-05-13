import * as React from "react";
import { cn } from "../../lib/utils";
import type { DataTable } from "../../schema/common";

export function TableView({ table, className }: { table: DataTable; className?: string }) {
  return (
    <div className={cn("overflow-auto rounded-2xl border border-[var(--line)]", className)}>
      <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th
                key={header}
                className="border-b border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-xs font-bold text-[var(--table-head)] first:w-[74px] first:whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className="border-b border-[var(--line)] px-4 py-3 align-top last:[tr:last-child_&]:border-b-0 first:w-[74px] first:whitespace-nowrap"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
