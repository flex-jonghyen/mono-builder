type GetListWithPaginationParams<Item> = {
  list: Item[];
  page: number;
  perPage: number;
};

export const getListWithPage = <Item>({
  list,
  page,
  perPage,
}: GetListWithPaginationParams<Item>): Item[] => {
  const start = page * perPage;
  const end = start + perPage;

  if (start < 0 || end > list.length) {
    return [];
  }

  return [...list].slice(start, end);
};
