import React from 'react'

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children: React.ReactNode
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({ children, className = '', ...props }, ref) => (
  <div className="overflow-x-auto">
    <table
      ref={ref}
      className={`w-full border-collapse ${className}`}
      {...props}
    >
      {children}
    </table>
  </div>
))

Table.displayName = 'Table'

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className = '', ...props }, ref) => (
    <thead ref={ref} className={`border-b border-neutral-200 bg-neutral-50 ${className}`} {...props}>
      {children}
    </thead>
  )
)

TableHeader.displayName = 'TableHeader'

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode
  header?: boolean
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className = '', header = false, ...props }, ref) => (
    <tr
      ref={ref}
      className={`
        border-b border-neutral-200 transition-fast
        ${!header ? 'hover:bg-neutral-50' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  )
)

TableRow.displayName = 'TableRow'

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ children, className = '', ...props }, ref) => (
    <th
      ref={ref}
      className={`px-6 py-3 text-left text-sm font-semibold text-neutral-700 ${className}`}
      {...props}
    >
      {children}
    </th>
  )
)

TableHead.displayName = 'TableHead'

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className = '', ...props }, ref) => (
    <td ref={ref} className={`px-6 py-4 text-sm text-neutral-900 ${className}`} {...props}>
      {children}
    </td>
  )
)

TableCell.displayName = 'TableCell'

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className = '', ...props }, ref) => (
    <tbody ref={ref} className={className} {...props}>
      {children}
    </tbody>
  )
)

TableBody.displayName = 'TableBody'

export { Table, TableHeader, TableRow, TableHead, TableCell, TableBody }
export default Table
