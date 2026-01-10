"use client";

import { useState } from "react";

interface QnAItem {
  question: string;
  answer: string;
}

interface QnAProps {
  items: QnAItem[];
}

export default function QnA({ items }: QnAProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) return null;

  return (
    <div className="mt-12 border-t pt-8">
      <h2 id="자주-묻는-질문" className="text-2xl font-bold mb-6">자주 묻는 질문</h2>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border rounded-lg">
            <button
              className="w-full text-left p-4 font-semibold hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span>{item.question}</span>
              <span className="text-2xl">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            {openIndex === index && (
              <div className="p-4 pt-0 text-gray-700 whitespace-pre-wrap">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
