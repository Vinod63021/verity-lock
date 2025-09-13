import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import { AppProvider } from "@/context/app-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 p-6 md:p-8">{children}</main>
        </div>
      </div>
    </AppProvider>
  );
}
