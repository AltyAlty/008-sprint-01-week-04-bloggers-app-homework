/*DTO для метаданных касательно пагинации.*/
export type PaginationMetaDataOutputDTO = {
  page: number;
  pageSize: number;
  pageCount: number;
  totalCount: number;
};
