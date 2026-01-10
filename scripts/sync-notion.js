const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const matter = require('gray-matter');

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

const TRIPS_DIR = path.join(process.cwd(), 'content/trips');
const IMAGES_DIR = path.join(process.cwd(), 'public/notion-images');

if (!fs.existsSync(TRIPS_DIR)) {
  fs.mkdirSync(TRIPS_DIR, { recursive: true });
}

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
      } else {
        reject(new Error(`Failed to download: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function getPageProperties(pageId) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const properties = page.properties;

  console.log('   Available properties:', Object.keys(properties).join(', '));

  let status = '';
  for (const key of Object.keys(properties)) {
    if (key.toLowerCase().includes('status')) {
      status = properties[key]?.status?.name || properties[key]?.select?.name || '';
      if (status) {
        console.log(`   Found status in property '${key}': ${status}`);
        break;
      }
    }
  }

  const getFullText = (textArray) => {
    if (!textArray || !Array.isArray(textArray)) return '';
    return textArray.map(item => item.plain_text || '').join('');
  };

  return {
    pageId: page.id,
    title: getFullText(properties.Title?.title) || '',
    date: properties.Date?.date?.start || new Date().toISOString().split('T')[0],
    excerpt: getFullText(properties.Excerpt?.rich_text) || '',
    lightColor: getFullText(properties.LightColor?.rich_text) || 'lab(62.926 59.277 -1.573)',
    darkColor: getFullText(properties.DarkColor?.rich_text) || 'lab(80.993 32.329 -7.093)',
    status: status,
  };
}

function findExistingFileByPageId(pageId) {
  const files = fs.readdirSync(TRIPS_DIR).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(TRIPS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);

    if (data.notionPageId === pageId) {
      return {
        exists: true,
        filePath: filePath,
        fileName: file,
        slug: file.replace('.md', '')
      };
    }
  }

  return { exists: false };
}

function deleteTripFile(slug) {
  const filePath = path.join(TRIPS_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`  🗑️  Deleted: ${slug}.md`);
    return true;
  }
  return false;
}

async function processPage(pageId, isNew = false) {
  const props = await getPageProperties(pageId);

  if (!props.title) {
    console.log(`⚠️  Skipping page ${pageId}: No title`);
    return null;
  }

  const slug = generateSlug(props.title);
  console.log(`\n📝 Processing: ${props.title} (${slug})`);
  console.log(`   Status: ${props.status}, Date: ${props.date}`);

  const existingFile = findExistingFileByPageId(pageId);
  if (existingFile.exists && existingFile.slug !== slug) {
    console.log(`  🔄 Title changed, removing old file: ${existingFile.fileName}`);
    fs.unlinkSync(existingFile.filePath);
  }

  const mdblocks = await n2m.pageToMarkdown(pageId);
  let markdown = n2m.toMarkdownString(mdblocks).parent;

  const imageMatches = markdown.match(/!\[.*?\]\((https?:\/\/.*?)\)/g);
  if (imageMatches) {
    for (const match of imageMatches) {
      const urlMatch = match.match(/\((https?:\/\/.*?)\)/);
      if (urlMatch) {
        const imageUrl = urlMatch[1];
        const imageFilename = `${slug}-${Date.now()}-${path.basename(new URL(imageUrl).pathname)}`;
        const imagePath = path.join(IMAGES_DIR, imageFilename);

        try {
          await downloadImage(imageUrl, imagePath);
          markdown = markdown.replace(imageUrl, `/notion-images/${imageFilename}`);
          console.log(`  📷 Downloaded image: ${imageFilename}`);
        } catch (error) {
          console.error(`  ❌ Failed to download image: ${error.message}`);
        }
      }
    }
  }

  // excerpt가 비어있으면 본문에서 추출
  let excerpt = props.excerpt;
  if (!excerpt && markdown) {
    const lines = markdown.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('!') && !trimmed.startsWith('-') && !trimmed.startsWith('*')) {
        excerpt = trimmed.slice(0, 150);
        if (trimmed.length > 150) excerpt += '...';
        break;
      }
    }
  }

  const frontmatter = `---
title: "${props.title}"
date: "${props.date}"
excerpt: "${excerpt || ''}"
lightColor: "${props.lightColor}"
darkColor: "${props.darkColor}"
notionPageId: "${props.pageId}"
---

`;

  const fullContent = frontmatter + markdown;
  const filePath = path.join(TRIPS_DIR, `${slug}.md`);

  fs.writeFileSync(filePath, fullContent, 'utf-8');

  if (isNew) {
    console.log(`  ✅ Published: ${slug}.md`);
  } else {
    console.log(`  ✅ Updated: ${slug}.md`);
  }

  return slug;
}

async function scheduledSync() {
  console.log('📅 Running scheduled sync...');

  const databaseId = process.env.NOTION_DATABASE_ID;
  const now = new Date().toISOString();

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
      and: [
        {
          property: 'Status',
          status: {
            equals: 'Published',
          },
        },
        {
          property: 'Date',
          date: {
            before: now,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  });

  console.log(`📚 Found ${response.results.length} published trips (date < now)`);

  let newPublishedSlugs = [];

  for (const page of response.results) {
    const pageId = page.id;
    const props = await getPageProperties(pageId);

    if (!props.title) continue;

    const slug = generateSlug(props.title);
    const existingFile = findExistingFileByPageId(pageId);

    if (!existingFile.exists) {
      console.log(`\n✨ New trip detected: ${slug}`);
      const publishedSlug = await processPage(pageId, true);
      if (publishedSlug) {
        newPublishedSlugs.push(publishedSlug);
      }
    } else {
      console.log(`\nℹ️  Already published: ${slug} (skipping)`);
    }
  }

  if (newPublishedSlugs.length > 0) {
    fs.writeFileSync('.published-slug', newPublishedSlugs[0], 'utf-8');
    console.log(`\n📌 New published slug saved: ${newPublishedSlugs[0]}`);
  } else {
    if (fs.existsSync('.published-slug')) {
      fs.unlinkSync('.published-slug');
    }
    console.log(`\nℹ️  No new trips published`);
  }

  return newPublishedSlugs.length > 0;
}

async function webhookSync() {
  console.log('⚡ Running webhook sync...');

  const pageId = process.env.SYNC_PAGE_ID;

  if (!pageId) {
    console.log('⚠️  No page_id provided, skipping webhook sync');
    return false;
  }

  console.log(`📄 Processing page: ${pageId}`);

  const props = await getPageProperties(pageId);

  if (!props.title) {
    console.log(`⚠️  Page has no title, skipping`);
    return false;
  }

  const slug = generateSlug(props.title);
  const status = props.status;

  console.log(`   Title: ${props.title}`);
  console.log(`   Slug: ${slug}`);
  console.log(`   Status: ${status}`);

  if (status === 'Deleted') {
    console.log(`\n🗑️  Deleting trip: ${slug}`);
    const deleted = deleteTripFile(slug);
    return deleted;
  }

  if (status === 'Published') {
    const existingFile = findExistingFileByPageId(pageId);

    if (existingFile.exists) {
      console.log(`\n✏️  Updating existing trip: ${slug}`);
      await processPage(pageId, false);
      return true;
    } else {
      console.log(`\n✨ Publishing new trip: ${slug}`);
      const publishedSlug = await processPage(pageId, true);
      if (publishedSlug) {
        fs.writeFileSync('.published-slug', publishedSlug, 'utf-8');
        console.log(`📌 New published slug saved: ${publishedSlug}`);
      }
      return true;
    }
  }

  console.log(`⚠️  Unknown status: ${status}`);
  return false;
}

async function syncNotionToTrips() {
  try {
    console.log('🔄 Starting Notion sync...');
    console.log(`   Trigger: ${process.env.TRIGGER_TYPE || 'unknown'}`);

    const databaseId = process.env.NOTION_DATABASE_ID;
    if (!databaseId) {
      throw new Error('NOTION_DATABASE_ID is not set');
    }

    const triggerType = process.env.TRIGGER_TYPE;
    let hasChanges = false;

    if (triggerType === 'repository_dispatch') {
      hasChanges = await webhookSync();
    } else {
      hasChanges = await scheduledSync();
    }

    if (!hasChanges) {
      console.log('\nℹ️  No changes made');
    }

    console.log('\n✅ Notion sync completed!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  }
}

syncNotionToTrips();
