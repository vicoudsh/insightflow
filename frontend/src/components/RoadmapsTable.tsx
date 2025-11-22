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
import { Roadmap } from '@/lib/api'

interface RoadmapsTableProps {
  roadmaps: Roadmap[]
}

export default function RoadmapsTable({ roadmaps }: RoadmapsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  // Debug logging
  console.log('RoadmapsTable received roadmaps:', roadmaps)
  console.log('RoadmapsTable roadmaps length:', roadmaps?.length)
  console.log('RoadmapsTable roadmaps type:', typeof roadmaps)

  const columns: ColumnDef<Roadmap>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: (info) => (
        <div className="font-medium text-gray-900">{info.getValue() as string}</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => {
        const status = info.getValue() as string
        const statusColors: Record<string, string> = {
          draft: 'bg-gray-100 text-gray-800',
          active: 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
        }
        return (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              statusColors[status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {status}
          </span>
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
    {
      accessorKey: 'tasks',
      header: 'Tasks',
      cell: (info) => {
        const tasks = (info.getValue() as Roadmap['tasks']) || []
        return (
          <div className="text-gray-600 text-sm">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data: roadmaps,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  if (roadmaps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No roadmaps found for this project
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

