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
import { useMutation, useQuery } from "@tanstack/react-query";
import { addPartialPayment } from "@/app/dashboard/payments/api";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { se } from "date-fns/locale";

interface Props {
  paymentId: string;
  refetch: () => void;
  pending: number;
}

type Currency = "USD" | "BSD";

export function PartialPaymentModal({ paymentId, refetch, pending }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number | string>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [amountUSD, setAmountUSD] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number | string>(0);

  const { data } = useQuery({
    queryKey: ["exchangeRate"],
    queryFn: async () => {
      const data = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
      const result = await data.json();
      setExchangeRate(result ? result.promedio : 0);
      return result
    },
    enabled: true,
  });

  useEffect(() => {
    setAmount(0);
    setAmountUSD(0);
    setChecked(false);
    if(data) setExchangeRate(data.promedio);
  }, [data]);

  const { toast } = useToast();

  const { mutate: addPartial } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { amount: number } }) =>
      addPartialPayment(id, data),
    onSuccess: () => {
      toast({
        variant: "success",
        title: "Abono de pago actualizado",
        description: "El abono del pago se ha actualizado correctamente",
      });
      refetch();
      setAmount(0);
      setChecked(false);
      setAmountUSD(0);
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
    const data = { amount: Number(amountUSD) };
    addPartial({ id: paymentId, data });
    return;
  };

  const handleChangeCheckbox = () => {
    setChecked(!checked);
    setAmount(!checked ? pending : 0);
    setAmountUSD(!checked ? pending : 0);
    if (!checked) setError("");
  };

  const handleChangeAmount = (number: number | string) => {
    const amount = Number(number);
    setAmount(number == "" ? "" : +amount);

    if(currency === "USD") setAmountUSD(+amount.toFixed(2));

    if(currency === "BSD") {
      setAmountUSD(+amount.toFixed(2) / +exchangeRate);
      if((amount / +exchangeRate) > pending) {
        setError("El monto a abonar no puede ser mayor al pendiente");
      } else {
        setError("");
      }
      return
    }

    if (amountUSD > pending) {
      setError("El monto a abonar no puede ser mayor al pendiente");
      return
    } else {
      setError("");
      return
    }
  };

  const handleChangeRate = (number: string) => {
    setExchangeRate(number == "" ? "" : Number(number));
    setAmountUSD(+amount / +exchangeRate);
  };

  const handleChangeCurrency = (currency: Currency) => {
    setCurrency(currency);
    setAmount(0);
    setAmountUSD(0);
    setError("");
  };

  const disabledBtn = Boolean(!amount || error);

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
          <span className="font-bold text-sm">
            En este modal podrás abonar al monto de la factura
          </span>
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
            max={currency === "USD" ? pending : pending * +exchangeRate}
          />
          {error && <span className="text-sm text-red-500">{error}</span>}
          <p className="text-md">Moneda de pago: {currency}</p>
          <RadioGroup value={currency}>
            <div className="flex items-center">
              <RadioGroupItem
                value="USD"
                className="mr-2"
                onClick={() => handleChangeCurrency("USD")}
              >
                USD
              </RadioGroupItem>{" "}
              USD
            </div>
            <div className="flex items-center">
              <RadioGroupItem
                value="BSD"
                className="mr-2"
                onClick={() => handleChangeCurrency("BSD")}
              >
                BSD
              </RadioGroupItem>{" "}
              BSD
            </div>
          </RadioGroup>

          {currency === "BSD" && (
            <>
              <span className="text-sm">Tasa de cambio:</span>
              <Input
                placeholder="Tasa de cambio"
                type="number"
                min={1}
                onChange={(e) =>
                  handleChangeRate(e.target.value === "" ? "" : e.target.value)
                }
                className="col-span-3"
                defaultValue={0}
                value={exchangeRate}
              />
              <span className="text-sm">
                Monto a abonar en USD: {amountUSD.toFixed(2)}
              </span>
            </>
          )}
          <span className="text-sm">Pendiente por pagar ($): {pending.toFixed(2)}</span>
          <span className="text-sm">
            Restante luego de abonar ($):{" "}
            {Number(amountUSD) > pending ? 0 : (pending - +amountUSD).toFixed(2)}
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
          <Button
            type="button"
            onClick={onSubmit}
            className="w-full"
            size={"lg"}
            disabled={disabledBtn}
          >
            {/* {isPending ? "Cargando..." : "Crear"} */} Abonar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
