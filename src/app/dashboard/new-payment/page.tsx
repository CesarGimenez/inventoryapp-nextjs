"use client"

import { useMutation, useQuery } from "@tanstack/react-query";

import { useState } from "react"
import { Check, Loader2, Plus, Trash } from 'lucide-react'

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
}

const paymentMethods = [
  { id: "Efectivo", name: "Efectivo" },
  { id: "Tarjeta", name: "Tarjeta" },
  { id: "Transferencia", name: "Transferencia" },
]

const paymentStatuses = [
  { id: "Pendiente", name: "Pendiente" },
  { id: "Pagado", name: "Pagado" },
]

export default function FormularioPedidoAlternativo() {
  const companyId = useCompanyStore((state) => state.defaultCompany?._id);
  const userId = useAuthStore((state) => state.user?._id);

  const router = useRouter();

  const [clienteSeleccionado, setClienteSeleccionado] = useState<string>('')
  const [productoSeleccionado, setProductoSeleccionado] = useState<string>("")
  const [metodoSeleccionado, setMetodoSeleccionado] = useState<string>("")
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("")
  const [cantidad, setCantidad] = useState(1)
  const [productosAgregados, setProductosAgregados] = useState<Array<PaymentDetail>>([])

  const { data: clients } = useQuery({
    queryKey: ["clients", companyId],
    queryFn: () => getMyClients(companyId),
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId
  });

  const { data: products } = useQuery({
    queryKey: ["products", companyId],
    queryFn: () => getMyProducts(companyId),
    staleTime: 1000 * 60 * 60,
    enabled: !!companyId
  });

  const { toast } = useToast()
  
  const agregarProducto = () => {
    const productoElegido = products.find((p: Product) => p._id === productoSeleccionado)

     if(productoElegido.quantity < cantidad) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No hay suficiente stock de este producto",
      })
      return
     }

      const productoExistente = productosAgregados.find((p) => p.name === productoElegido?.name)
      if (productoExistente) {

        const acumulado = productoExistente.quantity + cantidad

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
                quantity: p.quantity + cantidad,
                price: p.price + (productoElegido.price * cantidad),
                product: p.product
              }
            } else {
              return p
            }
          })
        )
        setProductoSeleccionado("")
        setCantidad(1)
        return
      }
      
      setProductosAgregados([...productosAgregados, {
        name: productoElegido.name,
        quantity: cantidad,
        price: productoElegido.price * cantidad,
        product: productoElegido._id
      }])
      setProductoSeleccionado("")
      setCantidad(1)
      return
  }

  const { mutate, isPending} = useMutation({
    mutationFn: async (data: any) => {
      return await createPayment(data);
    },
    onSuccess: () => {
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
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al crear el pago",
      });
    },
  });

  const disabledButton = !clienteSeleccionado || productosAgregados.length === 0 || !metodoSeleccionado || !estadoSeleccionado

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

  return (
    <div className="mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => router.push("/dashboard/payments")}>Ir pagos</Button>
      <h1 className="text-2xl font-bold">Formulario de Pedido</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cliente">Seleccionar cliente</Label>
          <Select value={clienteSeleccionado} onValueChange={setClienteSeleccionado}>
            <SelectTrigger id="cliente">
              <SelectValue placeholder="Seleccione un cliente" />
            </SelectTrigger>
            <SelectContent>
              {clients && clients.length > 0 ? (
                clients.map((cliente: Client) => (
                  <SelectItem key={cliente._id} value={cliente._id}>
                    {cliente.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="not-found" disabled>No hay clientes, te recomendamos agregar uno nuevo.</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="producto">Seleccionar Producto</Label>
          <Select value={productoSeleccionado} onValueChange={setProductoSeleccionado}>
            <SelectTrigger id="producto">
              <SelectValue placeholder="Seleccione un producto" />
            </SelectTrigger>
            <SelectContent>
              {products && products.length > 0 ? (
                products.map((product: Product) => (
                  <SelectItem key={product._id} value={product._id}>
                    {product.name} - ${product.price} ({product.quantity} disponibles)
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="not-found" disabled>No hay productos, te recomendamos agregar uno nuevo.</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        
        </div>
       

        <div className="flex items-center space-x-4 max-w-xl">
          <div className="flex-1">
            <Label htmlFor="cantidad">Cantidad</Label>
            <Input
              id="cantidad"
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              min={1}
            />
          </div>
          <Button onClick={agregarProducto} className="mt-6" disabled={!productoSeleccionado || !clienteSeleccionado}>
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Productos Agregados</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {productosAgregados.length === 0 ? (
            <p className="text-center text-gray-500">No hay productos agregados</p>
          ) : (
            productosAgregados.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 pb-2">
                <span className="font-semibold text-center">{item.name}</span>
                <span className="text-center">{item.quantity}</span>
                <span className="text-center">${item.price.toFixed(2)}</span>
                <Button className="max-w-20 items-end" variant="destructive" onClick={() => setProductosAgregados(productosAgregados.filter((p) => p.name !== item.name))}><Trash className="h-4 w-4" /></Button>
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
                className={`cursor-pointer transition-colors ${metodoSeleccionado === method.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
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
                className={`cursor-pointer transition-colors ${estadoSeleccionado === status.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
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
          Total: ${productosAgregados.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
        </span>
      </div>

      <Button className="w-full" disabled={disabledButton} onClick={completePayment}>{isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />} Finalizar</Button>
    </div>
  )
}