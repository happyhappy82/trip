import Link from "./Link";

interface TripCardProps {
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  lightColor: string;
  darkColor: string;
}

export default function TripCard({
  title,
  date,
  excerpt,
  slug,
  lightColor,
}: TripCardProps) {
  return (
    <Link
      className="block py-4"
      href={`/${slug}`}
    >
      <article>
        <h2
          className="text-[28px] font-black leading-none mb-2 text-gray-900"
        >
          {title}
        </h2>
        <p className="text-[13px] text-gray-700">{date}</p>
        <p className="mt-1">{excerpt}</p>
      </article>
    </Link>
  );
}
