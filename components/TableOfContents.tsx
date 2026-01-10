"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = document.querySelectorAll("article h2, article h3");
    const items: TocItem[] = [];

    headings.forEach((heading) => {
      const id = heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      const text = heading.textContent || "";
      const level = parseInt(heading.tagName.substring(1));

      if (id && text) {
        items.push({ id, text, level });
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
      { rootMargin: "-80px 0px -80% 0px" }
    );

    const headings = document.querySelectorAll("article h2, article h3");
    headings.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav className="sticky top-8">
      <div className="border-l-2 border-gray-200 pl-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          목차
        </p>
        <ul className="space-y-2">
          {toc.map((item) => (
            <li
              key={item.id}
              style={{ paddingLeft: `${(item.level - 2) * 0.75}rem` }}
            >
              <a
                href={`#${item.id}`}
                className={`block text-sm leading-relaxed transition-colors ${
                  activeId === item.id
                    ? "text-emerald-600 font-medium"
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
