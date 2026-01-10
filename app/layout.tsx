import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "여행 정보 가이드",
  description: "국내외 여행지 추천, 여행 팁, 숙소 정보 등 알찬 여행 정보를 제공합니다. 여행 계획부터 현지 꿀팁까지 한눈에 확인하세요.",
  metadataBase: new URL("https://tripinfolab.xyz"),
  keywords: ["여행", "여행지 추천", "여행 팁", "숙소", "관광", "해외여행", "국내여행"],
  authors: [{ name: "여행 정보 가이드" }],
  creator: "여행 정보 가이드",
  publisher: "여행 정보 가이드",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "여행 정보 가이드",
    description: "국내외 여행지 추천, 여행 팁, 숙소 정보 등 알찬 여행 정보를 제공합니다. 여행 계획부터 현지 꿀팁까지 한눈에 확인하세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://tripinfolab.xyz",
    siteName: "여행 정보 가이드",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "여행 정보 가이드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "여행 정보 가이드",
    description: "국내외 여행지 추천, 여행 팁, 숙소 정보 등 알찬 여행 정보를 제공합니다. 여행 계획부터 현지 꿀팁까지 한눈에 확인하세요.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "여행 정보 가이드",
    "alternateName": "여행 정보 가이드",
    "url": "https://tripinfolab.xyz",
    "description": "국내외 여행지 추천, 여행 팁, 숙소 정보 등 알찬 여행 정보를 제공합니다. 여행 계획부터 현지 꿀팁까지 한눈에 확인하세요.",
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="mx-auto max-w-5xl bg-white px-5 py-12 text-black">
        {children}
      </body>
    </html>
  );
}
