import { OrgSidebar } from "./_components/org-sidebar";
import Sidebar from "./_components/sidebar/sidebar";
import Navbar from "./_components/navbar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <main>
            <Sidebar />
            <div className="pl-[60px] h-full">
                <div className="flex gap-3 h-full">
                    <OrgSidebar />
                    <div className="h-full flex-1">
                        <Navbar />
                        {children}
                    </div>
                </div>
            </div>

        </main>
    )
}

export default DashboardLayout;