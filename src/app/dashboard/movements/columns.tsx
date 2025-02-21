"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef, SortDirection } from "@tanstack/react-table";

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
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
    accessorKey: "driver",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Conductor
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      const variant = type === "INGRESO" ? "success" : "destructive";
      return (
        <Badge variant={variant} capitalize>
          {type.toLowerCase()}
        </Badge>
      );
    },
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de creacion
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;

      return (
        <span>
          {format(new Date(createdAt), "dd/MM/yyyy - hh:mm a")}
        </span>
      );
    },
  },

  {
    accessorKey: "createdBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Encargado
          <SortedIcon isSorted={column.getIsSorted()} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdBy = row.getValue("createdBy") as string;

      return <span className="font-medium">{createdBy}</span>;
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      const ActionsMenu = () => {
        const router = useRouter();
        const redirectPaymentDetails = () => {
          router.push(`/dashboard/payments/payment-detail?id=${payment._id}`);
        };

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
              <DropdownMenuItem
                onClick={redirectPaymentDetails}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver detalle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      };

      return <ActionsMenu />;
    },
  },
];
