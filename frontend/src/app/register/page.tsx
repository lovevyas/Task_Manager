"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validators/auth";
import { z } from "zod";
import { registerRequest } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getApiErrorMessage } from "@/lib/api/error";

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema)
  });

  return (
    <form
      className="mx-auto max-w-md space-y-3 rounded-xl bg-white p-6 shadow"
      onSubmit={handleSubmit(async (values) => {
        try {
          await registerRequest(values);
          toast.success("Account created");
          router.push("/dashboard");
        } catch (error) {
          toast.error(getApiErrorMessage(error, "Registration failed"));
        }
      })}
    >
      <h1 className="text-xl font-semibold">Register</h1>
      <input className="w-full rounded border p-2" placeholder="Name" {...register("name")} />
      <input className="w-full rounded border p-2" placeholder="Email" {...register("email")} />
      <input className="w-full rounded border p-2" type="password" placeholder="Password" {...register("password")} />
      <button className="w-full rounded bg-blue-600 py-2 text-white">Create Account</button>
    </form>
  );
}
