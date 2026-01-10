"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("article h2");
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      const text = heading.textContent || "";

      if (id && text) {
        items.push({ id, text });
      }
    });

    setToc(items);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -70% 0px" }
    );

    const headings = document.querySelectorAll("article h2");
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <div className="border-l-2 border-gray-200 pl-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          목차
        </p>
        <ul className="space-y-3">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block text-sm leading-relaxed transition-colors duration-200 ${
                  activeId === item.id
                    ? "text-emerald-600 font-medium border-l-2 border-emerald-600 -ml-[18px] pl-4"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
