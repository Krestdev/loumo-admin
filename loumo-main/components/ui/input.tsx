'use client'
import * as React from "react"

import { cn } from "@/lib/utils"
import { Eye, EyeClosed } from "lucide-react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState<boolean>(false);
    if(type==="password"){
      return (
        <div className="relative">
          <input type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-10 w-full rounded-none border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}/>
          {showPassword ? <EyeClosed size={18} className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-paragraph" onClick={()=>setShowPassword(!showPassword)}/> : <Eye size={18} className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer text-paragraph" onClick={()=>setShowPassword(!showPassword)}/>}
        </div>
      )
    }
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none border border-input bg-transparent px-3 py-1 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }