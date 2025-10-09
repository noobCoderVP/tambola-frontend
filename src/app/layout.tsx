import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
// @ts-ignore
import "./globals.css";
import SparkleBackground from "@/components/SparkleBackground"; // imported client component

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Diwali Housie",
    description: "A festive twist on the classic game of Housie",
    openGraph: {
        images: [
            {
                url: "/og.png",
                width: 1200,
                height: 630,
                alt: "Diwali Housie",
            },
        ],
        title: "Diwali Housie",
        description: "A festive twist on the classic game of Housie",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased relative overflow-hidden`}
            >
                <SparkleBackground /> {/* Client component with animation */}
                <main className="relative z-10">{children}</main>
            </body>
        </html>
    );
}
