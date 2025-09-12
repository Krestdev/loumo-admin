import { statisticCard } from '@/types/types'
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { cn, XAF } from '@/lib/utils'
import { ArrowDown, ArrowUp } from 'lucide-react'

function StatCard({title, icon, value, valueName, isMoney=false, sub, variation}:statisticCard) {
  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
                {icon}
        </CardHeader>
        <CardContent>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-2xl font-bold text-gray-950">{(isMoney && typeof value === "number") ? XAF.format(value) : value} {valueName}</span>
                    {!!variation && variation !==0 && <span className={cn("px-2.5 py-1 flex items-center gap-2 rounded-sm", variation>0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600")}>{variation>0 ? <ArrowUp size={16}/> : <ArrowDown size={16}/>} {`${variation}%`}</span>}
            </div>
            { !!sub && 
                <div className="text-xs text-muted-foreground mt-2 pt-2 border-t border-gray-200">
                    <span>{`${sub.title} : `}</span>
                    <span className="font-medium text-gray-900">{(sub.isMoney && typeof sub.value === "number") ? XAF.format(sub.value) : sub.value}</span>
                </div>
            }
        </CardContent>
    </Card>
  )
}

export default StatCard