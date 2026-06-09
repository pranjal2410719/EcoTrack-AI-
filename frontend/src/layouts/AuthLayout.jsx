import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">EcoTrack AI</h1>
          <p className="text-gray-500 mt-2">Your carbon footprint assistant</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
