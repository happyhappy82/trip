interface QnAItem {
  question: string;
  answer: string;
}

export function extractQnA(content: string): QnAItem[] {
  const qnaRegex = /##\s*자주\s*묻는\s*질문\s*\n([\s\S]*?)(?=\n##\s|\n#\s|$)/i;
  const match = content.match(qnaRegex);

  if (!match) return [];

  const qnaSection = match[1];
  const items: QnAItem[] = [];

  const qaPairs = qnaSection.split(/\n###\s+/).filter(Boolean);

  for (const pair of qaPairs) {
    const lines = pair.trim().split('\n');
    const question = lines[0].replace(/^Q:\s*/i, '').trim();
    const answer = lines
      .slice(1)
      .join('\n')
      .replace(/^A:\s*/i, '')
      .trim();

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

export function removeQnASection(content: string): string {
  const qnaRegex = /##\s*자주\s*묻는\s*질문\s*\n[\s\S]*$/i;
  return content.replace(qnaRegex, '').trim();
}
