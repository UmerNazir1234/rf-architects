import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Site } from "@/lib/site";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
	variable: "--font-outfit",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: Site?.name,
	description: Site?.description,
	keywords: Site?.keywords,
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon.ico",
		apple: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml"></link>
			</head>
			<body className={`${outfit.variable} antialiased`}>{children}
				<Toaster />
			</body>
		</html>
	);
}
