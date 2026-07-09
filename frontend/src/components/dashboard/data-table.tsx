"use client";

import { type ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Skeleton } from "@/components/ui/skeleton";

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  emptyMessage = "No results",
}: {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  emptyMessage?: string;
}) {
  const table = useReactTable({ data, columns, getCoreRowModel: getCoreRowModel() });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-input" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-text-muted">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-surface">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-text-muted"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-border">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-elevated">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-text-primary">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
