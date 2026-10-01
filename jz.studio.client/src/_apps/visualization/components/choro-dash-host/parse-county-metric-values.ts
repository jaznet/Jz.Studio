import { CountyMetricValue } from 'jz-choro-dash';

/** Validate the wire contract before county values reach the color policy. */
export function parseCountyMetricValues(
  response: unknown
): readonly CountyMetricValue[] {
  if (!Array.isArray(response)) {
    throw new Error('County metrics response must be an array.');
  }

  const countyIds = new Set<string>();

  return response.map((item: unknown) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error('County metric must be an object.');
    }

    const { countyId, value } = item as Record<string, unknown>;

    if (typeof countyId !== 'string' || !/^\d{5}$/.test(countyId)) {
      throw new Error('County metric ID must contain five digits.');
    }

    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error('County metric value must be a finite number.');
    }

    if (countyIds.has(countyId)) {
      throw new Error('County metrics response contains a duplicate ID.');
    }

    countyIds.add(countyId);
    return { countyId, value };
  });
}
