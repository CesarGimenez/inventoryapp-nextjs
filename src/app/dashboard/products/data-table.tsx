"use client";
import { useState } from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Payment } from "@/data/payments.data";
import { ProductModal } from "./modal";
import { useCompanyStore } from "@/store";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  refetch?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  refetch,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [currentStatus, setCurrentStatus] = useState("all");
  const [currentCategory, setCurrentCategory] = useState("all");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const categories = useCompanyStore((state) => state.categories);

  const isDeleteVisible = Object.keys(rowSelection).length > 0;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filtrar por ...(nombre, categoria, etc)"
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => {
            setCurrentStatus("all");
            table.getColumn("category")?.setFilterValue(undefined);
            table.getColumn("name")?.setFilterValue(event.target.value);
          }}
          className="max-w-sm"
        />

        <Select
          value={currentStatus}
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("is_active")?.setFilterValue(undefined);
              table.getColumn("category")?.setFilterValue(undefined);
              setCurrentStatus("all");
              return;
            }
            
            const status = value === "active" ? true : false;
            setCurrentStatus(value);
            table.getColumn("category")?.setFilterValue(undefined);
            table.getColumn("is_active")?.setFilterValue(status);
          }}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Estatus - Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Estatus</SelectLabel>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={currentCategory}
          onValueChange={(value) => {
            if (value === "all") {
              table.getColumn("category")?.setFilterValue(undefined);
              setCurrentCategory("all");
              return;
            }

            setCurrentCategory(value);
            table.getColumn("category")?.setFilterValue(value);
          }}
        >
          <SelectTrigger className="w-[180px] ml-2">
            <SelectValue placeholder="Estatus - Todos" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Todas</SelectItem>
              {
                categories.map((category) => {
                  return (
                    <SelectItem key={category._id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  );
                })
              }
            </SelectGroup>
          </SelectContent>
        </Select>

        {isDeleteVisible && (
          <Button
            className="ml-2"
            variant="destructive"
            onClick={() => {
              // table.getSelectedRowModel().rows.forEach((row) => {
              //   console.log(row.original);
              // });

              const ids = table.getSelectedRowModel().rows.map((row) => {
                return (row.original as Payment).clientName;
              });
            }}
          >
            Delete
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .filter((column) => column.id !== "actions")
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* <Button className="ml-2">
          <Plus className="mr-2 h-4 w-4" /> Agregar
        </Button> */}
        <ProductModal refetch={refetch} />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel()?.rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="space-x-2 py-4 mx-2 flex justify-between items-center">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} de{" "}
            {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s)
          </div>

          <div className="flex items-center justify-end space-x-2 ">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>

        <Select
          onValueChange={(value) => {
            table.setPageSize(+value);
          }}
        >
          <SelectTrigger className="w-[180px] m-2">
            <SelectValue placeholder="10 filas" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filas por página</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="50">40</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
