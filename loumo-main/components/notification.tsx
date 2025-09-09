import { cn } from '@/lib/utils'
import { NotificationT } from '@/types/types'
import { cva, VariantProps } from 'class-variance-authority'
import { formatRelative } from 'date-fns'
import { fr } from 'date-fns/locale'
import React from 'react'
import { Button } from './ui/button'
import { X } from 'lucide-react'

const notificationVariants = cva(
  "w-full flex flex-row gap-2 rounded-lg p-3 shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]",
  {
    variants: {
      variant: {
        default: "bg-gray-50 text-gray-800",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-orange-50 text-orange-700",
        error: "bg-red-50 text-red-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type Props = NotificationT & {
  onDismiss?: (id: number) => void;
}

function Notification({
  id,
  createdAt,
  //type,
  variant,
  //orderId,
  //stockId,
  //paymentId,
  onDismiss,
}: Props) {

    const getVariantStyle = (variant: NotificationT["variant"]):VariantProps<typeof notificationVariants>["variant"] => {
        switch(variant){
            case "DANGER":
                return "error";
            case "SUCCESS":
                return "success";
            case "WARNING":
                return "warning";
            default :
            return "default";
        }
    }

    const getBadgeVariantStyle = (variant: NotificationT["variant"]) => {
        switch(variant){
            case "DANGER":
                return "bg-red-700 text-white";
            case "INFO":
                return  "bg-blue-200 text-blue-700";
            case "SUCCESS":
                return "bg-primary text-white";
            case "WARNING":
                return "bg-orange-200 text-orange-700";
            default :
                return "bg-gray-100 text-gray-900";
        }
    }
    

  return (
    <div className={cn(notificationVariants({ variant: getVariantStyle(variant) }))}>
      <div className="w-full flex flex-col gap-3">
        <div className="w-full flex flex-col md:flex-row gap-2 justify-start md:justify-between">
          <span className={cn("font-medium", getBadgeVariantStyle(variant))}>{"action"}</span>
          <span className="text-xs md:text-sm text-gray-400">
            {formatRelative(new Date(createdAt), new Date(), { locale: fr })}
          </span>
        </div>
        <p className="text-gray-600">{"description"}</p>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onDismiss?.(id)}
        aria-label="Fermer la notification"
      >
        <X size={16} />
      </Button>
    </div>
  )
}

export default Notification
