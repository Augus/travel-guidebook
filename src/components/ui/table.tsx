import * as React from "react";
import { cn } from "../../lib/utils";
import type { DataTable } from "../../schema/common";

export function TableView({ table, className }: { table: DataTable; className?: string }) {
  const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length));
  const isCompact = columnCount <= 2;
  const firstColumnValues = [table.headers[0], ...table.rows.map((row) => row[0])].filter(Boolean);
  const firstColumnMaxLength = Math.max(0, ...firstColumnValues.map((value) => value.replace(/\s/g, "").length));
  const measuredFirstColumnWidth = Math.ceil(firstColumnMaxLength * 16 + 44);
  const firstColumnWidth = isCompact ? Math.min(Math.max(measuredFirstColumnWidth, 88), 148) : 96;
  const getColumnStats = (index: number) => {
    const header = table.headers[index] ?? "";
    const values = [header, ...table.rows.map((row) => row[index] ?? "")].filter(Boolean);
    const maxLength = Math.max(0, ...values.map((value) => value.replace(/\s/g, "").length));

    return { header, maxLength };
  };
  const getColumnStyle = (index: number): React.CSSProperties => {
    if (isCompact) {
      return index === 0
        ? { minWidth: firstColumnWidth, width: "1%" }
        : { minWidth: "18rem" };
    }

    const { header, maxLength } = getColumnStats(index);

    if (index === 0) {
      return { minWidth: header.includes("日子") ? "9rem" : "7.5rem", width: "1%" };
    }

    if (header.includes("壓力") || maxLength <= 4) {
      return { minWidth: "6rem", width: "1%" };
    }

    if (header.includes("主要移動")) {
      return { minWidth: "19rem" };
    }

    if (header.includes("晚餐")) {
      return { minWidth: "17rem" };
    }

    if (header.includes("主題")) {
      return { minWidth: "15rem" };
    }

    return { minWidth: "14rem" };
  };

  return (
    <div className={cn("max-w-full overflow-x-auto overflow-y-hidden rounded-2xl pb-2 [scrollbar-gutter:stable]", className)}>
      <table
        className="w-full border-separate border-spacing-0 text-left table-auto"
        style={{
          minWidth: "100%"
        }}
      >
        <thead>
          <tr>
            {table.headers.map((header, index) => (
              <th
                key={header}
                className={cn(
                  "border-b border-t border-[var(--line)] bg-[var(--soft)] px-4 py-3 text-xs font-bold text-[var(--table-head)] first:whitespace-nowrap first:border-l first:rounded-tl-2xl last:border-r last:rounded-tr-2xl"
                )}
                style={getColumnStyle(index)}
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
                    "border-b border-[var(--line)] px-4 py-3 align-top first:border-l last:border-r last:[tr:last-child_&]:rounded-br-2xl first:[tr:last-child_&]:rounded-bl-2xl",
                    cellIndex === 0 ? "whitespace-nowrap" : undefined
                  )}
                  style={getColumnStyle(cellIndex)}
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
