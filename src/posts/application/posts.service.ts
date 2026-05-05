import { postsRepository } from '../repositories/posts.repository';
import { PostType } from '../types/post.type';
import { ObjectId, WithId } from 'mongodb';
import { GetPostsListQueryInputDTO } from '../routes/input-dto/get-posts-list-query.input-dto';
import { CreatePostInputDTO } from '../routes/input-dto/create-post.input-dto';
import { CreatePostInExistingBlogInputDTO } from '../routes/input-dto/create-post-in-existing-blog.input-dto';
import { UpdatePostInputDTO } from '../routes/input-dto/update-post.input-dto';
import { blogsService } from '../../blogs/application/blogs.service';

export const postsService = {
  async findMany(queryDTO: GetPostsListQueryInputDTO): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    return await postsRepository.findMany(queryDTO);
  },

  async findById(postId: string): Promise<WithId<PostType>> {
    return postsRepository.findById(postId);
  },

  async findManyByBlogId(
    blogId: string,
    queryDTO: GetPostsListQueryInputDTO,
  ): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    await blogsService.findById(blogId);
    return await postsRepository.findManyByBlogId(blogId, queryDTO);
  },

  async findAllByBlogId(blogId: string): Promise<WithId<PostType>[] | null> {
    return await postsRepository.findAllByBlogId(blogId);
  },

  async create(dto: CreatePostInputDTO): Promise<string> {
    const blog = await blogsService.findById(dto.blogId);

    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    return await postsRepository.create(newPost);
  },

  async createInExistingBlog(blogId: string, dto: CreatePostInExistingBlogInputDTO): Promise<string> {
    const blog = await blogsService.findById(blogId);

    const newPost: PostType = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      blogName: blog.name,
      createdAt: new Date(),
    };

    return await postsRepository.create(newPost);
  },

  async updateById(postId: string, dto: UpdatePostInputDTO): Promise<void> {
    return await postsRepository.updateById(postId, dto);
  },

  async deleteById(postId: string): Promise<void> {
    return await postsRepository.deleteById(postId);
  },

  async deleteManyByIds(postsIds: ObjectId[]): Promise<number> {
    return await postsRepository.deleteManyByIds(postsIds);
  },
};
