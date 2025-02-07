"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card"
import { User2Icon } from "lucide-react"

interface Props {
    data: any,
}

export function BestClientsList({ data }: Props) {

  return (
    <Card className="">
      <CardContent>
        {
            data.map((item: any) => (
                <div key={item._id} className="flex items-center justify-between px-5 pt-5">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-400 flex flex-row justify-center items-center"><User2Icon /></div>
                        <span>{item.client?.name}</span>
                    </div>
                    <span>${Number(item.total).toFixed(2)}</span>
                </div>
            ))
        }
      </CardContent>
    </Card>
  )
}
