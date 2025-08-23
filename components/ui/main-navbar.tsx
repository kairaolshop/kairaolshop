"use client";
import { cn } from "@/lib/utils";
import { ChartColumnStacked, Flag, Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function MainNav({
    className,
}: React.HTMLAttributes<HTMLElement>){
    const pathname= usePathname();
    const routes = [
        { href:`/dashboard`,
            label: "Admin_Dashboard",
            active: pathname === `/dashboard`,
            icon: ChartColumnStacked,
        },
    
        {
            href:`/category`,
            label: "Kelola Category",
            active: pathname === `/category`,
            icon: ChartColumnStacked,
        },
        {
            href:`/banner`,
            label: "Kelola Banners",
            active: pathname === `/banner`,
            icon: Flag,
            
        },
        {
            href:'/',
            label: "HomePage",
            active: pathname === `/`,
            icon: Store,
        },
    ]
    return (
        <nav className={cn("flex items-center gap-2 space-x-4",className)}>
            {routes.map((route) => {
                const Icon = route.icon;
                return (
                <Link
                key={route.href}
                href={route.href}
                className={cn("flex items-center gap-2 text-sm font-medium border-white rounded-md px-4 py-2 transition-colors hover:text-primary hover:bg-accent",
                    route.active
                    ?"text-black dark:text-white":"text-black/60 dark:text-white/60"
                )}>
                    <Icon className="w-4 h-4"/>
                {route.label}
                </Link>
                );
            })}
        </nav>
    );
}