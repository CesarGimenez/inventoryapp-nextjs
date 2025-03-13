"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { formatCurrency } from "@/utils"
import { StarFilledIcon } from "@radix-ui/react-icons"
import { Star, User2Icon } from "lucide-react"

interface Props {
    data: any,
}

export function BestClientsList({ data }: Props) {

  return (
    <Card className="">
      <CardContent>
        {
            data.map((item: any, index: number) => (
                <div key={item._id} className="flex items-center justify-between px-5 pt-5">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-400 flex flex-row justify-center items-center"><User2Icon /></div>
                        <span>{item.client?.name}</span>
                        { index === 0 && <Star className="text-amber-400"></Star> }
                        { index === 1 && <Star className="text-gray-400"></Star> }
                        { index === 2 && <Star className="text-primary"></Star> }
                    </div>
                    <span>${formatCurrency(item.total)}</span>
                </div>
            ))
        }
      </CardContent>
    </Card>
  )
}
