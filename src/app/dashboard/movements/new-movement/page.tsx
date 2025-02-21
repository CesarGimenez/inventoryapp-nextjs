"use client";

import { useMutation } from "@tanstack/react-query";

import { useEffect, useState } from "react";
import { Check, Loader2, Plus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore, useCompanyStore } from "@/store";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useEmployees, useProducts, useTrucks } from "@/hooks";
import { createMovement } from "@/api/movements/movements.api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface Driver {
  _id: string;
  name: string;
  is_active?: boolean;
  company?: string;
  type: string;
}

interface Truck {
  _id: string;
  plate: string;
  name: string;
  is_active?: boolean;
  company?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  is_active: boolean;
}
interface Detail {
  name: string;
  product: string;
  quantity: number;
  price: number;
}

const MOVEMENT_TYPES = ["INGRESO", "RETIRO"];

export default function Page() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const idUser = useAuthStore((state) => state.user?._id);
  const availableProducts = useCompanyStore((state) => state.availableProducts);

  const router = useRouter();

  const [driverSelected, setDriverSelected] = useState<string>("");
  const [productSelected, setProductSelected] = useState<string>("");
  const [truckSelected, setTruckSelected] = useState<string>("");
  const [cantidad, setCantidad] = useState<number | string>();
  const [productosAgregados, setProductosAgregados] = useState<
    Array<Detail>
  >([]);

  const [movementSelected, setMovementSelected] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const [queryProduct, setQueryProduct] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>();

  const { normalEmployees: employees } = useEmployees();
  const { data: products } = useProducts();
  const { data: trucks } = useTrucks();

  useEffect(() => {
    setFilteredProducts(availableProducts);
  }, [availableProducts]);

  const { toast } = useToast();

  useEffect(() => {
    if (queryProduct) {
      setFilteredProducts(
        availableProducts?.filter((p: Product) =>
          p.name.toLowerCase().includes(queryProduct.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(availableProducts);
    }
  }, [queryProduct, availableProducts]);

  const agregarProducto = () => {
    const productoElegido = products.find(
      (p: Product) => p._id === productSelected
    );

    if (productoElegido.quantity < Number(cantidad)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay suficiente stock de este producto",
      });
      return;
    }

    const productoExistente = productosAgregados.find(
      (p) => p.name === productoElegido?.name
    );
    if (productoExistente) {
      const acumulado = productoExistente.quantity + Number(cantidad);

      if (acumulado > productoElegido.quantity) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No hay suficiente stock de este producto",
        });
        return;
      }

      setProductosAgregados(
        productosAgregados.map((p) => {
          if (p.name === productoExistente.name) {
            return {
              name: productoExistente.name,
              quantity: p.quantity + Number(cantidad),
              price: p.price + productoElegido.price * Number(cantidad),
              product: p.product,
            };
          } else {
            return p;
          }
        })
      );
      setProductSelected("");
      setCantidad(1);
      return;
    }

    setProductosAgregados([
      ...productosAgregados,
      {
        name: productoElegido.name,
        quantity: Number(cantidad),
        price: productoElegido.price * Number(cantidad),
        product: productoElegido._id,
      },
    ]);
    setProductSelected("");
    setCantidad(1);
    return;
  };

    const { mutate, isPending} = useMutation({
      mutationFn: async (data: any) => {
        return await createMovement(data);
      },
      onSuccess: (data) => {
        console.log(data)
        toast({
          variant: "success",
          title: "Creado",
          description: "El registro se ha creado correctamente",
        });
        setCantidad(0)
        setDriverSelected('')
        setProductSelected('')
        setProductosAgregados([])
        setMovementSelected('')
        setNote('')
        setTruckSelected('')
        // setTimeout(() => {
        //   router.push(`/dashboard/move/payment-detail?id=${data.id}`);
        // }, 3000)
      },
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ha ocurrido un error al crear el registro",
        });
      },
    });

  const disabledButton = !driverSelected || productosAgregados?.length === 0 || !movementSelected || !truckSelected

  const completeMovement = () => {
    const data = {
      driver: driverSelected,
      company: companyId,
      details: productosAgregados,
      type: movementSelected,
      note,
      truck: truckSelected,
      createdBy: idUser,
    };
    mutate(data)
  };

  const handleFilterProducts = (text: string) => {
    setQueryProduct(text);
    return;
  };

  return (
    <div className="mx-auto p-6 space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/movements")}
      >
        Regresar
      </Button>
      <h1 className="text-2xl font-bold">Formulario de movimientos</h1>

      <div>
      <h2 className="text-md font-semibold mb-2">Tipo de movimiento</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOVEMENT_TYPES.map((movement, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-colors ${movementSelected === movement ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setMovementSelected(movement)}
              >
                <CardHeader>
                  <CardTitle>{movement}</CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Seleccionar conductor</Label>
            <Select value={driverSelected} onValueChange={setDriverSelected}>
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Seleccione un conductor" />
              </SelectTrigger>
              <SelectContent>
                {employees && employees?.length > 0 ? (
                  employees?.map((employee: Driver) => (
                    <SelectItem key={employee._id} value={employee._id}>
                      {employee.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="not-found" disabled>
                    No hay clientes, te recomendamos agregar uno nuevo.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cliente">Seleccionar vehiculo</Label>
            <Select value={truckSelected} onValueChange={setTruckSelected}>
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Seleccione un conductor" />
              </SelectTrigger>
              <SelectContent>
                {trucks && trucks?.length > 0 ? (
                  trucks?.map((truck: Truck) => (
                    <SelectItem key={truck._id} value={truck._id}>
                      {truck.name} - {truck.plate}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="not-found" disabled>
                    No hay vehiculos, te recomendamos agregar uno nuevo.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="producto">Seleccionar Producto</Label>
            <Select value={productSelected} onValueChange={setProductSelected}>
              <SelectTrigger id="producto">
                <SelectValue placeholder="Seleccione un producto" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Buscar producto..."
                    value={queryProduct}
                    onChange={(e) => handleFilterProducts(e.target.value)}
                    className="w-full"
                  />
                </div>
                {availableProducts && availableProducts?.length > 0 ? (
                  availableProducts?.map((product: Product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} - ({product.quantity}{" "}
                      unidades disponibles)
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="not-found" disabled>
                    No hay productos, te recomendamos agregar uno nuevo.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4 max-w-xl">
          <div className="flex-1">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              value={cantidad}
              onChange={(e) =>
                setCantidad(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={1}
            />
          </div>
          <Button
            onClick={agregarProducto}
            className="mt-6"
            disabled={!productSelected || !driverSelected}
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>
        </div>

        
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Productos Agregados</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {productosAgregados?.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay productos agregados
            </p>
          ) : (
            productosAgregados.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 pb-2">
                <span className="font-semibold text-center">{item.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-center">${item.price.toFixed(2)}</span>
                <Button
                  className="max-w-20 items-end"
                  variant="destructive"
                  onClick={() =>
                    setProductosAgregados(
                      productosAgregados.filter((p) => p.name !== item.name)
                    )
                  }
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-md font-semibold mb-2">Notas u observaciones: (Opcional)</h2>
        <textarea
          className="w-full border rounded-md p-2"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <Button className="w-full" disabled={disabledButton} onClick={completeMovement}>{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Finalizar</Button>
    </div>
  );
}
