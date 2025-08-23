"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Heart, ChevronDown, LayoutDashboard } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog"; 
import { ChartBarStacked } from 'lucide-react';
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories: Category[];
  session: Session | null;
}

export default function Header({ categories, session }: HeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isLoggedIn = !!session;
  const role = session?.user?.role || "GUEST"; // Default role menjadi GUEST jika tidak ada sesi

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="px-4 flex-row max-w-7xl mx-auto flex h-14 items-center justify-between">
    {/* Logo dan Brand (Selalu di kiri) */}
    <div className="flex items-center space-x-4">
      <Link href="/" className="flex gap-2 items-center text-sm font-semibold">
        <Image
          src="/Image/lubna.png"
          alt="logotoko"
          width={30}
          height={30}
          priority={true}
          className="w-8 h-auto"
        />
        Lubna Fashion
      </Link>
    </div>

    {/* Konten Kanan (Navigasi Desktop & Menu Autentikasi) */}
    <div className="flex items-center space-x-4">
      {/* Navigasi Desktop (Hanya muncul di desktop) */}
      {!isMobile && (
        <nav className="hidden md:flex items-center space-x-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </Link>
          {role === "ADMIN" && (
            <Link
              href="/dashboard"
              className="text-sm flex items-center font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
          )}
          {role === "USER" && (
            <Link href="/favorites" aria-label="Favorit">
              <Button variant="ghost" size="sm" className="px-2">
                <Heart className="h-4 w-4 mr-1 fill-red-500" /> Favorit
              </Button>
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Kategori <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link href={`/category/${category.slug}`}>
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      )}

      {/* Tombol Autentikasi / Avatar Desktop & Mobile Toggle */}
        <div className="flex items-center space-x-2">
          {isMobile ? (
            // Mobile menu (Sheet)
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <VisuallyHidden>
                  <DialogTitle>Menu</DialogTitle>
                </VisuallyHidden>
                <nav className="flex flex-col gap-4 pt-6">
                  <Link
                    href="/"
                    className="text-lg font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </Link>
                  {role === "USER" && (
                    <Link
                      href="/favorites"
                      className="text-lg font-medium hover:text-primary ml-2  flex items-center gap-2 transition-colors"
                    >
                     <Heart className="fill-red-500" />Favorit 
                    </Link>
                  )}
                  {role === "ADMIN" && (
                    <Link
                      href="/dasboard"
                      className="ml-2 text-lg flex items-center font-medium hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="mr-2 text-blue-500"/> Dashboard
                    </Link>
                  )}
                  <h3 className="text-lg ml-2 flex gap-2 items-center font-medium text-muted-foreground">
                    <ChartBarStacked /> Kategori
                  </h3>
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                      className="ml-10 text-base hover:text-primary transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </nav>
                <div className=" p-4">
                  {isLoggedIn ? (
                    <Button onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
                      Keluar
                    </Button>
                  ) : (
                    <Button asChild className="w-full className=w-full text-black bg-[radial-gradient(circle,_#f3e0a6,_#fac114)] transition-colors">
                      <Link href="/login">Masuk</Link>
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            // Desktop Avatar/Login Button
            isLoggedIn ? (
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session?.user?.image || ""}
                    alt={session?.user?.name || "User"}
                  />
                  <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="w-full className=w-full text-white  transition-colors">
              <Link href="/login">Masuk</Link>
            </Button>
          )
        )}
      </div>
    </div>
  </div>
</header>
  );
}