import { defaultPaginationSettingsType } from '../../../core/types/pagination/default-pagination-settings.type';
import { PostSortFieldInputDTO } from './post-sort-field.input-dto';

export type GetPostsListInExistingBlogQueryInputDTO = defaultPaginationSettingsType<PostSortFieldInputDTO>;
