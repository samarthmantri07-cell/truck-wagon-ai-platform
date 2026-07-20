import os

base = 'C:/Users/samar/OneDrive/Desktop/Final_Project/truck-wagon-ai-platform/frontend'

def ensure_dir(path):
    os.makedirs(os.path.join(base, path), exist_ok=True)

# Generate Input component
ensure_dir('src/components/ui')
input_tsx = """import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
export { Input }
"""
with open(os.path.join(base, 'src', 'components', 'ui', 'input.tsx'), 'w', encoding='utf-8') as f:
    f.write(input_tsx)

# Generate Table component
table_tsx = """import * as React from "react"
import { cn } from "@/lib/utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }
"""
with open(os.path.join(base, 'src', 'components', 'ui', 'table.tsx'), 'w', encoding='utf-8') as f:
    f.write(table_tsx)


# Generate Remaining Pages
pages = {
    'history': 'History & Logs',
    'reports': 'Automated Reports',
    'cameras': 'Camera Management',
    'settings': 'System Settings',
    'profile': 'User Profile'
}

for route, title in pages.items():
    ensure_dir(f'src/app/{route}')
    content = """"use client"
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function REPLACEROUTECAPPage() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">REPLACETITLE</h2>
        <p className="text-muted-foreground">Manage your REPLACEROUTE settings and data.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>REPLACETITLE Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50 text-slate-400 font-medium">
            This module is successfully initialized with the design system.
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
""".replace('REPLACEROUTECAP', route.capitalize()).replace('REPLACETITLE', title).replace('REPLACEROUTE', route)

    with open(os.path.join(base, f'src/app/{route}/page.tsx'), 'w', encoding='utf-8') as f:
        f.write(content)

print("Extra components and pages generated.")
