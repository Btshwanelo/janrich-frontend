import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RouteProvider } from "@/providers/route-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { ToastProvider } from "@/components/base/toast";
import "./globals.css";
import ReduxProvider from "@/components/ReduxProvider";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: "JanRich Frontend",
    description: "JanRich Frontend Application",
};

export const viewport: Viewport = {
    colorScheme: "light",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
            <body className="bg-gray-50 antialiased">
                <RouteProvider>
                    <ThemeProvider>
                        <ReduxProvider>
                            <ToastProvider>
                                {children}
                            </ToastProvider>
                        </ReduxProvider>
                    </ThemeProvider>
                </RouteProvider>
            </body>
        </html>
    );
}