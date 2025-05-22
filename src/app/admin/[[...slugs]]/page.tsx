"use client";
import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/cms/AdminApp"), { ssr: false });

export default function AdminPage() {
  return <AdminApp />;
}
