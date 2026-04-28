"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DoctorProvider } from "./_context/DoctorContext";
import DoctorSidebar from "./_components/DoctorSidebar";
import DoctorTopbar from "./_components/DoctorTopbar";

const DASHBOARD_ROUTES = ["/doctor/overview", "/doctor/weeklyschedule", "/doctor/patientrecords"];

export default function DoctorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboardRoute = DASHBOARD_ROUTES.some(r => pathname.startsWith(r));

  if (!isDashboardRoute) {
    return (
      <div style={{ background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        {children}
      </div>
    );
  }

  return (
    <DoctorProvider>
      <div className="min-h-screen relative" style={{ background: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
        {/* Subtle radial highlight — top-right corner */}
        <div
          className="fixed top-0 right-0 w-[600px] h-[600px] pointer-events-none z-0"
          style={{ background: "radial-gradient(circle at top right, rgba(37,99,235,0.04) 0%, transparent 60%)" }}
        />
        <DoctorSidebar />
        <div className="ml-64 min-h-screen relative z-10">
          <DoctorTopbar />
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </DoctorProvider>
  );
}
