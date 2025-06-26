import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

export interface navigationHeader {
    title:string;
    header:string;
    description?:string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
}

export interface sidebarItemGroup {
    title: string;
    items: navigationHeader[];
}