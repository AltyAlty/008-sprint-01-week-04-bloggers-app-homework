import { defaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { PostSortFieldInputDTO } from './post-sort-field.input-dto';

export type GetPostsListQueryInputDTO = defaultPaginationSettingsType<PostSortFieldInputDTO>;
