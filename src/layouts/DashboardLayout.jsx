import Sidebar from "@/components/shared/Sidebar"
import Topbar from "@/components/shared/Topbar"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 overflow-y-auto text-gray-800 dark:text-gray-100 p-4">{children}</main>
      </div>
    </div>
  )
}
