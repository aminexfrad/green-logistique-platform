'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  searchable?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  itemsPerPage?: number
  actions?: (row: any) => React.ReactNode
}

export function DataTable({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  onSearch,
  itemsPerPage = 10,
  actions,
}: DataTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
    setCurrentPage(1)
  }

  // Filter and sort data
  let filteredData = data
  if (searchQuery) {
    filteredData = data.filter((item) =>
      columns.some((col) => {
        const value = item[col.key]
        return String(value).toLowerCase().includes(searchQuery.toLowerCase())
      })
    )
  }

  if (sortConfig) {
    filteredData = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const paginatedData = filteredData.slice(startIdx, endIdx)

  const handleSort = (key: string) => {
    const column = columns.find((col) => col.key === key)
    if (!column?.sortable) return

    if (sortConfig?.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setSortConfig({ key, direction: 'asc' })
    }
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-sidebar-accent/5">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(col.width && `w-[${col.width}]`, 'h-12')}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <button
                    className={cn(
                      'flex items-center gap-2 font-semibold',
                      col.sortable && 'cursor-pointer hover:text-foreground',
                      !col.sortable && 'cursor-default',
                    )}
                  >
                    {col.label}
                    {col.sortable && sortConfig?.key === col.key && (
                      <span className="text-xs">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </button>
                </TableHead>
              ))}
              {actions && <TableHead className="w-[100px] text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
                <TableRow
                  key={idx}
                  className="hover:bg-sidebar-accent/5 transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell key={col.key} className="py-3">
                      {col.render
                        ? col.render(row[col.key], row)
                        : String(row[col.key])}
                    </TableCell>
                  ))}
                  {actions && (
                    <TableCell className="text-right">
                      {actions(row)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIdx + 1} to {Math.min(endIdx, filteredData.length)} of{' '}
            {filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
