
import { MainNav } from "@/components/ui/main-navbar";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";


export default async function DashboardLayout({
    children,}:{children: React.ReactNode;
}) {
    const session = await getAuthSession();
    if (!session || session.user.role !== "ADMIN")
       { redirect("/login");}

    return (
        <>
       <div className="max-w-7xl mx-auto mt-10 bg-stone-200 border rounded-sm">
        <MainNav className="p-2"/>
        </div>
        {children}
        </>
    )
}