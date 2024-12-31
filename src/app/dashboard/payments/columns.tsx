"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, FilterFn, Row, SortDirection } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Checkbox } from "@/components/ui/checkbox";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Check, Clock, Download, Eye, Printer, X } from "lucide-react";
import {
  downloadInvoice,
  printInvoice,
  setCompletePayment,
  setPendingPayment,
} from "./api";
import { usePayment } from "./usePayment";
import { useCompanyStore } from "@/store";

interface Payment {
  _id: string;
  status: string;
}
// const myCustomFilterFn: FilterFn<Payment> = (
//   row: Row<Payment>,
//   columnId: string,
//   filterValue: string,
//   addMeta: (meta: any) => void
// ) => {
//   filterValue = filterValue.toLowerCase();

//   const filterParts = filterValue.split(" ");
//   const rowValues =
//     `${row.original.email} ${row.original.clientName} ${row.original.status}`.toLowerCase();

//   return filterParts.every((part) => rowValues.includes(part));
// };

const SortedIcon = ({ isSorted }: { isSorted: false | SortDirection }) => {
  if (isSorted === "asc") {
    return <ChevronUpIcon className="h-4 w-4" />;
  }

  if (isSorted === "desc") {
    return <ChevronDownIcon className="h-4 w-4" />;
  }

  return null;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "client",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estatus
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant =
        status === "Pagado"
          ? "success"
          : status === "Pendiente"
          ? "info"
          : "destructive";
      return (
        <Badge variant={variant} capitalize>
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "total",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Total
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const total = row.getValue("total") as string;

      return <span className="font-medium">${total}</span>;
    },
  },

  {
    accessorKey: "payment_method",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Metodo de pago
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const method = row.getValue("payment_method") as string;

      return <Badge capitalize>{method}</Badge>;
    },
  },

  {
    accessorKey: "seller",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Vendedor
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const seller = row.getValue("seller") as string;

      return <span className="font-medium">{seller}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(payment._id);
                toast("Payment ID copied to clipboard", {
                  position: "top-right",
                  duration: 3000,
                });
              }}
            >
              Copiar ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </DropdownMenuItem>
            {(payment.status as string) === "Pagado" && (
              <>
                <DropdownMenuItem onClick={downloadInvoice}>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar factura
                </DropdownMenuItem>
                <DropdownMenuItem onClick={printInvoice}>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir factura
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setPendingPayment(payment?._id);
                  }}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Marcar como pendiente
                </DropdownMenuItem>
              </>
            )}
            {(payment.status as string) === "Pendiente" && (
              <>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Descargar factura
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir factura
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setCompletePayment(payment?._id)
                  }}
                >
                  <Check className="mr-2 h-4 w-4" />
                  Marcar como pagado
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
