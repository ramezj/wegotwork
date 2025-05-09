import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Bricolage_Grotesque } from "next/font/google";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin']
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={bricolageGrotesque.className} suppressHydrationWarning >
      <body suppressHydrationWarning
        className={`${bricolageGrotesque.className} antialiased bg-theme`}
      >
         <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
         <Toaster toastOptions={{
          className: 'bg-white text-black font-extrabold rounded-sm',
          style: {
            fontWeight: 'extrabold'
          }
         }} />
        {children}
          </ThemeProvider>
      </body>
    </html>
  );
}
