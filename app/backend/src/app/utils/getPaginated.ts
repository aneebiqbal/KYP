export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}

export function getPaginated<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const total = items.length;
  const lastPage = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const data = items.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    lastPage,
  };
}
