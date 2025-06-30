import NotificationProvider from "@/providers/notifications";
import QueryProvider from "@/providers/queryProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react18-json-view/src/style.css";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s - Loumo",
    default: "Loumo Admin - Gestion de Loumo-Shop",
  },
  description: "Grocery e-commerce back office dashboard",
  icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png"
    },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased`}>
        <QueryProvider>
          <NotificationProvider>
            {/* <Notification /> */}
            {children}
          </NotificationProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
