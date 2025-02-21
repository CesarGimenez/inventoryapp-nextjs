"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Client {
  _id: string
  name: string
}

interface Props {
  clients: Client[]
  clienteSeleccionado: string
  setClienteSeleccionado: React.Dispatch<React.SetStateAction<string>>
}

export default function ClienteSelect({ clients, clienteSeleccionado, setClienteSeleccionado }: Props) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")

  const filteredClients = query === ""
    ? clients
    : clients.filter((cliente) =>
        cliente.name.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div>
      <Label htmlFor="cliente">Seleccionar cliente</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {clienteSeleccionado
              ? clients.find((cliente) => cliente._id === clienteSeleccionado)?.name
              : "Seleccione un cliente"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" >
          <Command>
            <CommandInput
              placeholder="Buscar cliente..."
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>No hay clientes, te recomendamos agregar uno nuevo.</CommandEmpty>
              <CommandGroup>
                {filteredClients && filteredClients.map((cliente) => (
                  <CommandItem
                    key={cliente._id}
                    value={cliente._id}
                    onSelect={(currentValue) => {
                      setClienteSeleccionado(currentValue === clienteSeleccionado ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    {/* <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        clienteSeleccionado === cliente._id ? "opacity-100" : "opacity-0"
                      )}
                    /> */}
                    {cliente.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
