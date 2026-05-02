import { PaginationMetaDataOutputDTO } from '../../../core/types/pagination/pagination-meta-data.output-dto';
import { PostOutputDTO } from './post.output-dto';

export type PaginatedPostsListOutputDTO = PaginationMetaDataOutputDTO & { items: PostOutputDTO[] };
