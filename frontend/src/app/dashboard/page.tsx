"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TaskDashboard } from "@/components/tasks/TaskDashboard";
import { logoutRequest, restoreSession } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const check = async () => {
      try {
        await restoreSession();
      } catch {
        toast.error("Please login to continue");
        router.replace("/login");
      } finally {
        setCheckingSession(false);
      }
    };

    check();
  }, [router]);

  if (checkingSession) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-20 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          className="bg-slate-900 hover:bg-black"
          onClick={async () => {
            await logoutRequest();
            toast.success("Logged out");
            router.replace("/login");
          }}
        >
          Logout
        </Button>
      </div>
      <TaskDashboard />
    </section>
  );
}
