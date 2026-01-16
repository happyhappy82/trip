import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

const tripsDirectory = path.join(process.cwd(), 'content/trips');

function extractExcerpt(content: string, maxLength: number = 150): string {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('!') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
      if (trimmed.length > maxLength) {
        return trimmed.slice(0, maxLength) + '...';
      }
      return trimmed;
    }
  }
  return '';
}

export interface Trip {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  lightColor: string;
  darkColor: string;
  readingTime: string;
  notionPageId?: string;
}

export function getSortedTripsData(): Trip[] {
  if (!fs.existsSync(tripsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(tripsDirectory);
  const allTripsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(tripsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug: data.slug || slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || extractExcerpt(content),
        content,
        lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
        darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
        readingTime: readingTime(content).text,
        notionPageId: data.notionPageId,
      };
    });

  return allTripsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getTripBySlug(slug: string): Trip | null {
  const fullPath = path.join(tripsDirectory, `${slug}.md`);

  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      slug: data.slug || slug,
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || extractExcerpt(content),
      content,
      lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
      darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
      readingTime: readingTime(content).text,
      notionPageId: data.notionPageId,
    };
  }

  if (!fs.existsSync(tripsDirectory)) {
    return null;
  }

  const fileNames = fs.readdirSync(tripsDirectory);
  for (const fileName of fileNames) {
    if (!fileName.endsWith('.md')) continue;

    const filePath = path.join(tripsDirectory, fileName);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    if (data.slug === slug) {
      return {
        slug: data.slug,
        title: data.title || '',
        date: data.date || '',
        excerpt: data.excerpt || extractExcerpt(content),
        content,
        lightColor: data.lightColor || 'lab(62.926 59.277 -1.573)',
        darkColor: data.darkColor || 'lab(80.993 32.329 -7.093)',
        readingTime: readingTime(content).text,
        notionPageId: data.notionPageId,
      };
    }
  }

  return null;
}
