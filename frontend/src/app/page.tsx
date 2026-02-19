import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Task Manager</h1>
      <div className="flex gap-3">
        <Link className="rounded-lg bg-blue-600 px-4 py-2 text-white" href="/login">Login</Link>
        <Link className="rounded-lg bg-slate-900 px-4 py-2 text-white" href="/register">Register</Link>
      </div>
    </div>
  );
}
