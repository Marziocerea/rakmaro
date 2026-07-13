import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rakmaro.com"),
  title: "Création de société et résidence aux Émirats | Rakmaro",
  description:
    "Rakmaro accompagne les entrepreneurs pour créer leur société aux Émirats, obtenir leur résidence, leur Emirates ID et ouvrir leur compte professionnel.",
  alternates: {
    canonical: "/",
    languages: {
      fr: "/",
      en: "/?lang=en",
    },
  },
  openGraph: {
    title: "Création de société et résidence aux Émirats | Rakmaro",
    description:
      "Un interlocuteur direct pour créer votre société, obtenir votre résidence, préparer l’Emirates ID, ouvrir votre compte professionnel et structurer votre installation aux Émirats.",
    url: "/",
    siteName: "Rakmaro",
    images: [
      {
        url: "/assets/dubai-downtown-dawn.jpg",
        width: 1920,
        height: 1080,
        alt: "Dubai skyline at dawn",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Company setup and UAE residency | Rakmaro",
    description:
      "Company setup, residence visa, Emirates ID and business account opening for entrepreneurs moving to the UAE.",
    images: ["/assets/dubai-downtown-dawn.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
