import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import TableOfContents from "@/components/TableOfContents";
import QnA from "@/components/QnA";
import { getTripBySlug, getSortedTripsData } from "@/lib/trips";
import { extractQnA, removeQnASection } from "@/lib/qna-utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const trips = getSortedTripsData();
  return trips.map((trip) => ({
    slug: trip.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = getTripBySlug(slug);

  if (!trip) {
    return {
      title: "Not Found",
    };
  }

  const url = `https://www.thetripguide.xyz/${slug}/`;

  return {
    title: trip.title,
    description: trip.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: trip.title,
      description: trip.excerpt,
      url: url,
      siteName: "더트립가이드",
      locale: "ko_KR",
      type: "article",
      publishedTime: trip.date,
      authors: ["더트립가이드"],
    },
    twitter: {
      card: "summary_large_image",
      title: trip.title,
      description: trip.excerpt,
    },
  };
}

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  const trip = getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const qnaItems = extractQnA(trip.content);
  const contentWithoutQnA = removeQnASection(trip.content);

  const baseUrl = "https://www.thetripguide.xyz";
  const pageUrl = `${baseUrl}/${slug}/`;

  // Article Schema (보완)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: trip.title,
    description: trip.excerpt,
    author: {
      "@type": "Organization",
      name: "더트립가이드",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "더트립가이드",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/og-image.png`,
      },
    },
    datePublished: trip.date,
    dateModified: trip.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    image: `${baseUrl}/og-image.png`,
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: trip.title,
        item: pageUrl,
      },
    ],
  };

  // FAQPage Schema (Q&A가 있을 때만)
  const faqSchema = qnaItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qnaItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } : null;

  return (
    <>
      <Header />
      <div className="relative">
        {/* Main Content */}
        <article className="max-w-3xl">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
          />
          {faqSchema && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
          )}

          <div className="mb-8">
            <h1
              className="text-[42px] font-black leading-tight mb-4"
              style={{ color: trip.lightColor }}
            >
              {trip.title}
            </h1>
            <div className="flex gap-4 text-sm text-gray-600">
              <time dateTime={trip.date}>{trip.date.split('T')[0]}</time>
              <span>{trip.readingTime}</span>
            </div>
          </div>

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h2: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return <h2 id={id} className="scroll-mt-24" {...props} />;
                },
                h3: ({ node, ...props }) => {
                  const text = props.children?.toString() || "";
                  const id = text.toLowerCase().replace(/\s+/g, "-");
                  return <h3 id={id} className="scroll-mt-24" {...props} />;
                },
              }}
            >
              {contentWithoutQnA}
            </ReactMarkdown>
          </div>

          <QnA items={qnaItems} />
        </article>

        {/* Sidebar TOC - Fixed position on right */}
        <aside className="hidden xl:block fixed top-24 right-8 w-56">
          <TableOfContents />
        </aside>
      </div>
    </>
  );
}
