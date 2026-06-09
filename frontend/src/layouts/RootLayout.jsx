import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "../components/Navbar";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Made with 🌱 for a greener planet — EcoTrack AI
          </p>
        </div>
      </footer>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: "12px",
            padding: "16px",
          },
        }}
      />
    </div>
  );
}
