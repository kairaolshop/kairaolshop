import { MainNav } from "@/components/ui/main-navbar";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { getAuthSession } from "@/lib/auth";
import { Description } from "@radix-ui/react-dialog";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session || session.user.role !== "ADMIN"){ redirect("/login");}

  return (
    <>
      <div className="max-w-7xl mx-auto mt-10 bg-stone-200 border rounded-sm flex justify-between p-2">
        {/* Desktop Nav */}
        <MainNav className="hidden md:flex" />

        {/* Mobile Nav */}
        <Sheet>
          <SheetTrigger className="md:hidden">
            <Menu className="w-6 h-6" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetTitle className="hidden">Menu</SheetTitle>
            <Description className="ml-4 font-bold mt-4 border-b">Menu</Description>
            <MainNav className="flex flex-col gap-2 items-start" />
          </SheetContent>
        </Sheet>
      </div>
      {children}
    </>
  );
}
