"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { DialogDescription } from "@radix-ui/react-dialog";
import { usePayment } from "@/app/dashboard/payments/usePayment";
import { useMutation } from "@tanstack/react-query";
import { addPartialPayment } from "@/app/dashboard/payments/api";

interface Props {
    paymentId: string;
    refetch: () => void;
    pending: number;
}

export function PartialPaymentModal( { paymentId, refetch, pending }: Props ) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | string>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setAmount(0);
    setChecked(false);
  }, []);

  const { toast } = useToast();

  const { mutate: addPartial } = useMutation({
    mutationFn: ({ id, data }: { id: string, data: { amount: number}}) => addPartialPayment(id, data),
    onSuccess: () => {
        toast({
            variant: "success",
            title: "Abono de pago actualizado",
            description: "El abono del pago se ha actualizado correctamente",
        });
        refetch();
        setOpen(false);
    },
    onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al crear el abono",
        });
      },
  });

  const onSubmit = () => {
    const data = { amount: Number(amount) };
    addPartial({ id: paymentId, data });
    return;
  };

  const handleChangeCheckbox = () => {
    setChecked(!checked);
    setAmount(!checked ? pending : 0);
    if(!checked) setError("")
  };

  const handleChangeAmount = (number: number | string) => {
    setAmount(number == "" ? "" : Number(number))
    if (Number(number) > pending) {
        setError("El monto a abonar no puede ser mayor al pendiente")
    } else {
        setError("")
    }
  };

  const disabledBtn = Boolean(!amount || error)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default"> Abonar a factura </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="modal-modal-description"
      >
        <DialogHeader>
          <DialogTitle>Monto a abonar</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className="font-bold text-sm">En este modal podrás abonar al monto de la factura</span>
        </DialogDescription>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Monto a abonar"
            type="number"
            min={1}
            onChange={(e) => handleChangeAmount(e.target.value)}
            className="col-span-3"
            defaultValue={0}
            value={amount}
            disabled={checked}
            max={pending}
          />
          {
            error && <span className="text-sm text-red-500">{error}</span>
          }
          <span className="text-sm">
            Pendiente por pagar ($): {pending}
          </span>
          <span className="text-sm">
            Restante luego de abonar ($): {Number(amount) > pending ? 0 : pending - Number(amount)}
          </span>
          <div className="flex flex-row gap-3 items-center">
            <Checkbox
              className="col-span-3"
              value="deuda-completa"
              onClick={handleChangeCheckbox}
              checked={checked}
            />
            <span className="text-sm">Abonar deuda completa</span>
          </div>
          <Button type="button" onClick={onSubmit} className="w-full" size={"lg"} disabled={disabledBtn}>
            {/* {isPending ? "Cargando..." : "Crear"} */} Abonar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
