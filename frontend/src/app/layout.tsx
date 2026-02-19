import "./globals.css";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        <main className="mx-auto min-h-screen w-full max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}
