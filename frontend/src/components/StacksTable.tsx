'use client'

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { Stack } from '@/lib/api'

interface StacksTableProps {
  stacks: Stack[]
}

export default function StacksTable({ stacks }: StacksTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const columns: ColumnDef<Stack>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <div className="font-medium text-gray-900">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: 'technology',
      header: 'Technology',
      cell: (info) => {
        const value = info.getValue() as string | undefined
        return (
          <div className="text-gray-600">
            {value || <span className="text-gray-400">—</span>}
          </div>
        )
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: (info) => {
        const value = info.getValue() as string | undefined
        return (
          <div className="text-gray-600 text-sm line-clamp-2">
            {value || <span className="text-gray-400">—</span>}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: stacks,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (stacks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No stacks found for this project
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: ' ↑',
                      desc: ' ↓',
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

