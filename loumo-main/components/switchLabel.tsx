import { useId } from "react"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

type Props = {
  value: boolean;
  onChange: ()=>void;
  name: string;
  description?:string;
}

export default function SwitchLabel({name, description, value, onChange}:Props) {
  const id = useId()
  return (
    <div className="border-input has-data-[state=checked]:border-primary/50 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
      <Switch
        id={id}
        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
        aria-describedby={`${id}-description`}
        checked={value}
        onCheckedChange={onChange}
      />
      <div className="grid grow gap-2">
        <Label htmlFor={id} className="capitalize">
          {`${name} `}
            <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
            {`(${value ? "Actif" : "Désactivé"})`}
          </span>
        </Label>
        {
          description &&
          <p id={`${id}-description`} className="text-muted-foreground text-xs">
          {description}
        </p>}
      </div>
    </div>
  )
}
