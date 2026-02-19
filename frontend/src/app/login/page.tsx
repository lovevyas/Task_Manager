"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators/auth";
import { z } from "zod";
import { loginRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api/error";

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <form
      className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 shadow"
      onSubmit={handleSubmit(async (values) => {
        try {
          await loginRequest(values);
          toast.success("Logged in");
          router.push("/dashboard");
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Login failed"));
        }
      })}
    >
      <h1 className="text-xl font-semibold">Login</h1>
      <input className="w-full rounded border p-2" placeholder="Email" {...register("email")} />
      <input className="w-full rounded border p-2" type="password" placeholder="Password" {...register("password")} />
      <button className="w-full rounded bg-blue-600 py-2 text-white">Sign In</button>
    </form>
  );
}
