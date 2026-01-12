import { MetadataRoute } from 'next';
import { getSortedTripsData } from '@/lib/trips';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.thetripguide.xyz';
  const trips = getSortedTripsData();

  const tripUrls = trips.map((trip) => ({
    url: `${baseUrl}/${trip.slug}/`,
    lastModified: new Date(trip.date),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...tripUrls,
  ];
}
