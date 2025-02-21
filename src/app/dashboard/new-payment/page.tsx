"use client"

import { useMutation, useQuery } from "@tanstack/react-query";

import { useEffect, useRef, useState } from "react"
import { Check, Loader2, Pencil, Plus, Trash } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthStore, useCompanyStore } from "@/store";
import { getMyClients } from "../clients/api";
import { getMyProducts } from "@/api/products/products.api";
import { useToast } from "@/components/ui/use-toast";
import { createPayment } from "./api";
import { useRouter } from "next/navigation";
import { useClients, useProducts } from "@/hooks";

interface Client {
  _id: string;
  name: string;
  phone: string;
  is_active: boolean;
  createdBy: string;
  company: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  is_active: boolean;
}
interface PaymentDetail {
  name: string;
  product: string;
  quantity: number;
  price: number;
  discount: number;
}

const paymentMethods = [
  { id: "Efectivo", name: "Efectivo" },
  { id: "Tarjeta", name: "Tarjeta" },
  { id: "Transferencia", name: "Transferencia" },
  { id: "Credito", name: "Credito" },
]

const paymentStatuses = [
  { id: "Pendiente", name: "Pendiente" },
  { id: "Pagado", name: "Pagado" },
]

export default function FormularioPedido() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const userId = useAuthStore((state) => state.user?._id);
  const availableProducts = useCompanyStore((state) => state.availableProducts);

  const router = useRouter();

  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('')
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("")
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string>("")
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("")
  const [cantidad, setCantidad] = useState<number | string>()
  const [discount, setDiscount] = useState<number | string>(0)
  const [subTotal, setSubTotal] = useState<number>(0)

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  const [productosAgregados, setProductosAgregados] = useState<Array<PaymentDetail>>([])

  const [queryClient, setQueryClient] = useState("")
  const [filteredClients, setFilteredClients] = useState<Client[]>()

  const [queryProduct, setQueryProduct] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>()

  const { data: clients } = useClients();

  const { data: products } = useProducts();

  useEffect(() => {
    setFilteredClients(clients)
    setFilteredProducts(availableProducts)
  }, [clients, availableProducts])

  const { toast } = useToast()

  useEffect(() => {
    if (queryClient) {
      setFilteredClients(clients?.filter((c: Client) => c.name.toLowerCase().includes(queryClient.toLowerCase())))
    } else {
      setFilteredClients(clients)
    }
  }, [queryClient, clients])

  useEffect(() => {
    if (queryProduct) {
      setFilteredProducts(availableProducts?.filter((p: Product) => p.name.toLowerCase().includes(queryProduct.toLowerCase())))
    } else {
      setFilteredProducts(availableProducts)
    }
  }, [queryProduct, availableProducts])

  useEffect(() => {
    if (metodoSeleccionado === "Credito") {
      setEstadoSeleccionado("Pendiente")
    }
  }, [metodoSeleccionado])

  useEffect(() => {
    if(products && products?.length > 0 && productoSeleccionado !== '') {
      setCurrentProduct(products.find((p: Product) => p._id === productoSeleccionado))
    }
  }, [productoSeleccionado, products])

  useEffect(() => {
    if(currentProduct && Number(cantidad) > 0) {
      const subtotal = (currentProduct.price * Number(cantidad)) - (currentProduct.price * Number(cantidad) * (Number(discount) / 100))
      setSubTotal(Number(subtotal.toFixed(2)))
    }
  }, [currentProduct, cantidad, discount])

  useEffect(() => {
    const productListed = productosAgregados.find((p: PaymentDetail) => p.product === productoSeleccionado)
      if (productListed) {
        setDiscount(productListed.discount)
        setCantidad(productListed.quantity)
        setSubTotal(productListed.price)
      } else {
        setDiscount(0)
        setCantidad(0)
        setSubTotal(0)
      }
  }, [productosAgregados, productoSeleccionado])
  
  const agregarProducto = () => {
    const productoElegido = currentProduct as Product

     if(productoElegido.quantity < Number(cantidad)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay suficiente stock de este producto",
      })
      return
     }

      const productoExistente = productosAgregados.find((p) => p.name === productoElegido?.name)
      if (productoExistente) {

        const acumulado = productoExistente.quantity + Number(cantidad)

        if(acumulado > productoElegido.quantity) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No hay suficiente stock de este producto",
          })
          return
        }

        setProductosAgregados(
          productosAgregados.map((p) => {
            if (p.name === productoExistente.name) {
              return {
                name: productoExistente.name,
                quantity: p.quantity + Number(cantidad),
                price: (p.price + (productoElegido.price * Number(cantidad))) - (productoElegido.price * Number(cantidad) * (Number(discount) / 100)),
                product: p.product,
                discount: Number(discount)
              }
            } else {
              return p
            }
          })
        )
        setProductoSeleccionado("")
        setCantidad(0)
        setDiscount(0)
        setSubTotal(0)
        return
      }
      
      setProductosAgregados([...productosAgregados, {
        name: productoElegido.name,
        quantity: Number(cantidad),
        price: subTotal,
        product: productoElegido._id,
        discount: Number(discount)
      }])
      setProductoSeleccionado("")
      setCantidad(0)
      setDiscount(0)
      setSubTotal(0)
      return
  }

  const editarProducto = (productId: string) => {
    const product = productosAgregados.find((p) => p.product === productId)
    setProductosAgregados(productosAgregados.map((p) => {
      if (product && p.name === product.name) {
        return {
          name: product.name,
          quantity: Number(cantidad),
          price: subTotal,
          product: product.product,
          discount: Number(discount)
        }
      } else {
        return p
      }
    }))
  }

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: any) => {
      return await createPayment(data);
    },
    onSuccess: (data) => {
      console.log(data)
      toast({
        variant: "success",
        title: "Creado",
        description: "El pago se ha creado correctamente",
      });
      setCantidad(0)
      setClienteSeleccionado('')
      setEstadoSeleccionado('')
      setMetodoSeleccionado('')
      setProductoSeleccionado('')
      setProductosAgregados([])
      setTimeout(() => {
        router.push(`/dashboard/payments/payment-detail?id=${data.id}`);
      }, 3000)
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el pago",
      });
    },
  });

  const disabledButton = !clienteSeleccionado || productosAgregados?.length === 0 || !metodoSeleccionado || !estadoSeleccionado

  const completePayment = () => {
    const data = {
      client: clienteSeleccionado,
      seller: userId,
      company: companyId,
      total: productosAgregados.reduce((acc, p) => acc + p.price, 0),
      payment_details: productosAgregados,
      payment_method: metodoSeleccionado,
      status: estadoSeleccionado
    }
    mutate(data)
  }

  const handleFilterClient = (text: string) => {
    setQueryClient(text)
    return;
  }

  const handleFilterProducts = (text: string) => {
    setQueryProduct(text)
    return;
  }

  const handleEditProduct = (detail: PaymentDetail) => {
    setProductoSeleccionado(detail.product)
    setDiscount(detail.discount)
    setCantidad(detail.quantity)
    return;
  }

  return (
    <div className="mx-auto p-6 space-y-6">
      <Button
        variant="outline"
        onClick={() => router.push("/dashboard/payments")}
      >
        Ir ventas
      </Button>
      <h1 className="text-2xl font-bold">Formulario de Pedido</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cliente">Seleccionar cliente</Label>
            <Select
              value={clienteSeleccionado}
              onValueChange={setClienteSeleccionado}
            >
              <SelectTrigger id="cliente">
                <SelectValue placeholder="Seleccione un cliente" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Buscar cliente..."
                    value={queryClient}
                    onChange={(e) => handleFilterClient(e.target.value)}
                    className="w-full"
                  />
                </div>
                {clients && clients?.length > 0 ? (
                  filteredClients?.map((cliente: Client) => (
                    <SelectItem key={cliente._id} value={cliente._id}>
                      {cliente.name}
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
            <Label htmlFor="producto">Seleccionar Producto</Label>
            <Select
              value={productoSeleccionado}
              onValueChange={setProductoSeleccionado}
            >
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
                  filteredProducts?.map((product: Product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.name} - ${product.price} ({product.quantity}{" "}
                      disponibles)
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
        </div>

        <div className="flex items-center space-x-4 max-w-2xl">
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

          <div className="flex-1">
            <Label htmlFor="descuento">% Descuento (Opcional)</Label>
            <Input
              id="descuento"
              type="number"
              value={discount}
              onChange={(e) =>
                setDiscount(e.target.value === "" ? "" : Number(e.target.value))
              }
              min={0}
              max={100}
              defaultValue={0}
            />
          </div>

          <div className="flex-1 items-center">
            <Label htmlFor="subtotal">Subtotal ($): </Label>
            <Input id="subtotal" type="number" value={subTotal} disabled />
          </div>
          {
            productosAgregados?.find((item) => item.product === productoSeleccionado) ? (
              <Button
                onClick={() => editarProducto(productoSeleccionado)}
                className="mt-6"
                disabled={!productoSeleccionado || !clienteSeleccionado}
              >
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </Button>
            ) : (
              <Button
                onClick={agregarProducto}
                className="mt-6"
                disabled={!productoSeleccionado || !clienteSeleccionado}
              >
                <Plus className="mr-2 h-4 w-4" /> Agregar
              </Button>
            )
          }
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
                <span className="text-center">
                  ${item.price.toFixed(2)}{" "}
                  {item.discount > 0 ? `(-${item.discount}%)` : null}
                </span>
                <div className="flex gap-2">
                  <Button
                    className="max-w-20 items-end"
                    variant="default"
                    onClick={() => handleEditProduct(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
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
              </div>
            ))
          )}
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-md font-semibold mb-2">Metodo de pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <Card
              key={method.id}
              className={`cursor-pointer transition-colors ${
                metodoSeleccionado === method.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => setMetodoSeleccionado(method.id)}
            >
              <CardHeader>
                <CardTitle>{method.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-md font-semibold mb-2">Estatus de pago</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentStatuses.map((status) => (
            <Card
              key={status.id}
              className={`cursor-pointer transition-colors ${
                estadoSeleccionado === status.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
              onClick={() => setEstadoSeleccionado(status.id)}
            >
              <CardHeader>
                <CardTitle>{status.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="text-center">
        <span className="font-bold">
          Total: $
          {productosAgregados
            .reduce((sum, item) => sum + item.price, 0)
            .toFixed(2)}
        </span>
      </div>

      <Button
        className="w-full"
        disabled={disabledButton}
        onClick={completePayment}
      >
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Check className="mr-2 h-4 w-4" />
        )}{" "}
        Finalizar
      </Button>
    </div>
  );
}