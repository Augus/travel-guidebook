import * as React from "react";
import { cn } from "../../lib/utils";
import type { DataTable } from "../../schema/common";

export function TableView({ table, className }: { table: DataTable; className?: string }) {
  const isCompact = table.headers.length <= 2;
  const firstColumnClass = isCompact ? "first:w-[132px] md:first:w-[170px]" : "first:w-[74px]";

  return (
    <div className={cn("overflow-auto rounded-2xl", className)}>
      <table className={cn("w-full border-separate border-spacing-0 text-left", isCompact ? "min-w-0 table-fixed" : "min-w-[760px]")}>
        <thead>
          <tr>
            {table.headers.map((header) => (
              <th
                key={header}
                className={cn(
                  "border-b border-t border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-xs font-bold text-[var(--table-head)] first:whitespace-nowrap first:border-l first:rounded-tl-2xl last:border-r last:rounded-tr-2xl",
                  firstColumnClass
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr className={rowIndex % 2 === 1 ? "[&>td]:bg-[var(--table-zebra)]" : undefined} key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={`${rowIndex}-${cellIndex}`}
                  className={cn(
                    "border-b border-[var(--line)] px-4 py-3 align-top first:whitespace-nowrap first:border-l last:border-r last:[tr:last-child_&]:rounded-br-2xl first:[tr:last-child_&]:rounded-bl-2xl",
                    firstColumnClass
                  )}
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
