import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.thetripguide.xyz';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/_next/static/',   // 빌드 파일 (검색에 무의미)
          '/notion-images/',  // 이미지 파일 (중복 색인 방지)
          '/*.json',          // JSON 설정 파일
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
