/*DTO для разрешенных значений query-параметра "sortBy" для сортировки данных по водителям на странице при пагинации.*/
export enum DriverSortFieldInputDTO {
  CreatedAt = 'createdAt',
  Name = 'name',
  Email = 'email',
}
