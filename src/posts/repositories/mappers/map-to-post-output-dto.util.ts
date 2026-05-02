import { WithId } from 'mongodb';
import { PostOutputDTO } from '../../routers/output-dto/post.output-dto';
import { PostType } from '../../types/post.type';

export const mapToPostOutputDTO = (post: WithId<PostType>): PostOutputDTO => {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
  };
};
