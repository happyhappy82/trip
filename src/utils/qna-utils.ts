export interface QnAItem {
  question: string;
  answer: string;
}

// FAQ 섹션 제목 패턴들 (번호 접두사, 부제 등 부가 텍스트 허용)
const FAQ_SECTION_PATTERNS = [
  /##\s*[^#\n]*자주\s*묻는\s*질문[^\n]*\n/i,
  /##\s*[^#\n]*여행\s*전\s*필수\s*FAQ[^\n]*\n/i,
  /##\s*[^#\n]*FAQ[^\n]*\n/i,
  /##\s*[^#\n]*Q\s*&\s*A[^\n]*\n/i,
  /##\s*[^#\n]*QnA[^\n]*\n/i,
];

export function extractQnA(content: string): QnAItem[] {
  const items: QnAItem[] = [];

  // 1. 토글(details) 형식 추출
  const toggleItems = extractFromToggle(content);
  items.push(...toggleItems);

  // 2. 마크다운 헤딩 형식 추출 (FAQ 섹션 내)
  const headingItems = extractFromHeadings(content);
  items.push(...headingItems);

  // 중복 제거 (질문 기준)
  const uniqueItems = items.filter(
    (item, index, self) =>
      index === self.findIndex((t) => t.question === item.question)
  );

  return uniqueItems;
}

// 토글(<details>) 형식에서 QnA 추출
function extractFromToggle(content: string): QnAItem[] {
  const items: QnAItem[] = [];

  // <details><summary>질문</summary>답변</details> 형식
  const detailsRegex =
    /<details[^>]*>\s*<summary[^>]*>([\s\S]*?)<\/summary>\s*([\s\S]*?)<\/details>/gi;

  let match;
  while ((match = detailsRegex.exec(content)) !== null) {
    const question = match[1].trim();
    const answer = match[2].trim();

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

// 마크다운 헤딩 형식에서 QnA 추출
function extractFromHeadings(content: string): QnAItem[] {
  const items: QnAItem[] = [];

  // FAQ 섹션 찾기
  let faqSectionStart = -1;
  let faqSectionPattern: RegExp | null = null;

  for (const pattern of FAQ_SECTION_PATTERNS) {
    const match = content.match(pattern);
    if (match && match.index !== undefined) {
      if (faqSectionStart === -1 || match.index < faqSectionStart) {
        faqSectionStart = match.index + match[0].length;
        faqSectionPattern = pattern;
      }
    }
  }

  if (faqSectionStart === -1) return items;

  // FAQ 섹션 끝 찾기 (다음 ## 헤딩 또는 문서 끝)
  const afterFaq = content.slice(faqSectionStart);
  const nextSectionMatch = afterFaq.match(/\n##\s+(?!#)/);
  const faqSection = nextSectionMatch
    ? afterFaq.slice(0, nextSectionMatch.index)
    : afterFaq;

  // <details> 블록 제거 (toggle 형식은 extractFromToggle에서 처리)
  // 닫히지 않은 <details> 블록도 함께 제거 (섹션 경계에서 잘린 경우 대응)
  const cleanedFaqSection = faqSection.replace(/<details[\s\S]*?(<\/details>|$)/gi, '');

  // ### 헤딩으로 분리
  const headingParts = cleanedFaqSection.split(/\n###\s+/).filter(Boolean);

  for (const part of headingParts) {
    const lines = part.trim().split('\n');
    if (lines.length === 0) continue;

    // 첫 줄이 질문
    let question = lines[0].trim();

    // 질문 앞의 패턴들 제거: "Q:", "1.", "2.", 등
    question = question
      .replace(/^Q:\s*/i, '') // Q: 제거
      .replace(/^\d+\.\s*/, '') // 1., 2. 등 번호 제거
      .replace(/\?$/, '') // 끝의 ? 제거 후 다시 추가
      .trim();

    if (question && !question.endsWith('?')) {
      question += '?';
    }

    // 나머지 줄이 답변
    let answer = lines
      .slice(1)
      .join('\n')
      .replace(/^A:\s*/i, '') // A: 제거
      .trim();

    // 리스트 형태의 답변 정리 (- 로 시작하는 줄들)
    if (answer.startsWith('-')) {
      answer = answer
        .split('\n')
        .map((line) => line.replace(/^-\s*/, '').trim())
        .filter(Boolean)
        .join(' ');
    }

    if (question && answer) {
      items.push({ question, answer });
    }
  }

  return items;
}

export function removeQnASection(content: string): string {
  let result = content;

  // 각 FAQ 섹션 패턴에 대해 제거
  for (const pattern of FAQ_SECTION_PATTERNS) {
    const match = result.match(pattern);
    if (match && match.index !== undefined) {
      const beforeSection = result.slice(0, match.index);
      const afterMatch = result.slice(match.index);

      // 다음 ## 헤딩 찾기
      const nextSectionMatch = afterMatch
        .slice(match[0].length)
        .match(/\n##\s+(?!#)/);
      if (nextSectionMatch && nextSectionMatch.index !== undefined) {
        // 다음 섹션이 있으면 그 전까지만 제거
        const sectionEnd = match.index + match[0].length + nextSectionMatch.index;
        result = beforeSection + result.slice(sectionEnd);
      } else {
        // 다음 섹션이 없으면 끝까지 제거
        result = beforeSection;
      }
    }
  }

  return result.trim();
}
