interface IServiceOperations<TSource extends { id: any }, TResponse> {
  getAll: () => Promise<TResponse[]>;
  getById: (id: TSource["id"]) => Promise<TResponse | undefined>;
  create: (item: Partial<TSource>) => Promise<TResponse>;
  edit: (id: TSource["id"], item: TSource) => Promise<TResponse>;
  remove: (id: TSource["id"]) => Promise<TResponse>;
  search: (item: Partial<TSource>) => Promise<TResponse | undefined>;
  searchAll: (item: Partial<TSource>) => Promise<TResponse[]>;
  pagination: PaginationOperation<TSource, TResponse>;
}

type PaginationOperation<TSource, TResponse> = (
  page: number,
  limit: number,
  orderBy: keyof TSource,
  desc: boolean
) => Promise<{
  data: TResponse[];
  page: number;
  limit: number;
  count: number;
}>;

export default IServiceOperations;
