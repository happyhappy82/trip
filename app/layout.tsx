import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "더트립가이드",
  description: "숨은 명소부터 맛집, 숙소까지 전 세계 모든 여행 정보를 한눈에 확인하고 당신만의 특별한 여정을 완성해 보세요.",
  metadataBase: new URL("https://www.thetripguide.xyz"),
  keywords: ["여행", "여행지 추천", "여행 팁", "숙소", "관광", "해외여행", "국내여행"],
  authors: [{ name: "더트립가이드" }],
  creator: "더트립가이드",
  publisher: "더트립가이드",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "더트립가이드",
    description: "숨은 명소부터 맛집, 숙소까지 전 세계 모든 여행 정보를 한눈에 확인하고 당신만의 특별한 여정을 완성해 보세요.",
    type: "website",
    locale: "ko_KR",
    url: "https://www.thetripguide.xyz",
    siteName: "더트립가이드",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "더트립가이드",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "더트립가이드",
    description: "숨은 명소부터 맛집, 숙소까지 전 세계 모든 여행 정보를 한눈에 확인하고 당신만의 특별한 여정을 완성해 보세요.",
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
  verification: {
    google: "NcQrZvNEBO9TE4yaWHY5IoS-MryqqhlWAhdgPqdyu14",
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
    "name": "더트립가이드",
    "alternateName": "더트립가이드",
    "url": "https://www.thetripguide.xyz",
    "description": "숨은 명소부터 맛집, 숙소까지 전 세계 모든 여행 정보를 한눈에 확인하고 당신만의 특별한 여정을 완성해 보세요.",
  };

  return (
    <html lang="ko">
      <head>
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MHKVX5TG');`,
          }}
        />
        {/* End Google Tag Manager */}
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-1M1P837C6Y" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-1M1P837C6Y');`,
          }}
        />
        {/* End Google tag */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="bg-white text-black">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MHKVX5TG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <div className="mx-auto max-w-4xl px-5 py-12">
          {children}
        </div>
      </body>
    </html>
  );
}
