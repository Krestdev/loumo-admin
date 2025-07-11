"use client"

import {
  LogOut,
  Settings
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { sidebarContent } from "@/data/navigation"
import { useStore } from "@/providers/datastore"

export function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();
  const { logout } = useStore();  

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b px-6 py-4">
        {/* <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Box className="h-4 w-4" />
          </div>
          {state === "expanded" && (
            <div className="flex flex-col">
              <span className="text-lg font-semibold">{"Loumo"}</span>
              <span className="text-xs text-muted-foreground">{"Back Office"}</span>
            </div>
          )}
        </div> */}
        <Link href={"/dashboard"} className="flex">
          { state === "collapsed" ? <img src={"/logo-mini.svg"} alt="logo" className="size-4"/> : <img src={"/logo.svg"} alt="logo" className="h-8 w-auto"/> }
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        { sidebarContent.map((item, id)=>(
          <SidebarGroup key={id}>
          <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.filter(x=>x.display).map((subItem) => (
                <SidebarMenuItem key={subItem.title}>
                  <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                    <Link href={subItem.url}>
                      <subItem.icon className="h-4 w-4" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start gap-2 px-2 h-auto py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/user.png" />
                <AvatarFallback>{"AD"}</AvatarFallback>
              </Avatar>
              {state === "expanded" && (
                <div className="flex flex-col items-start text-sm flex-1">
                  <span className="font-medium">{"Admin"}</span>
                  <span className="text-xs text-muted-foreground">{"admin@loumo-shop.com"}</span>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56" side="top">
            <DropdownMenuLabel>{"Mon compte"}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2" size={16} />
              {"Profil"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2" size={16} />
              {"Paramètres"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={()=>{logout();}}>
              <LogOut className="mr-2" size={16} />
              {"Déconnexion"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
