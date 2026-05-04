import { postsCollection } from '../../db/mongodb/mongo.db';
import { PostType } from '../types/post.type';
import { Filter, ObjectId, WithId } from 'mongodb';
import { RepositoryNotFoundError } from '../../core/errors/repository-not-found.error';
import { GetPostsListQueryInputDTO } from '../routes/input-dto/get-posts-list-query.input-dto';
import { UpdatePostInputDTO } from '../routes/input-dto/update-post.input-dto';

export const postsRepository = {
  async findMany(queryDTO: GetPostsListQueryInputDTO): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDTO;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<PostType> = {};

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findById(postId: string): Promise<WithId<PostType>> {
    const res = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!res) throw new RepositoryNotFoundError('Post does not exist');
    return res;
  },

  async findManyByBlogId(
    blogId: string,
    queryDTO: GetPostsListQueryInputDTO,
  ): Promise<{ items: WithId<PostType>[]; totalCount: number }> {
    const { pageNumber, pageSize, sortBy, sortDirection } = queryDTO;
    const skip = (pageNumber - 1) * pageSize;
    const filter: Filter<PostType> = {};
    filter.blogId = { $regex: blogId, $options: 'i' };

    const [items, totalCount] = await Promise.all([
      postsCollection
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .toArray(),
      postsCollection.countDocuments(filter),
    ]);

    return { items, totalCount };
  },

  async findAllByBlogId(blogId: string): Promise<WithId<PostType>[] | null> {
    const posts = await postsCollection.find({ blogId: blogId }).toArray();
    if (!posts || posts.length === 0) return null;
    return posts;
  },

  async create(newPost: PostType): Promise<string> {
    const insertResult = await postsCollection.insertOne(newPost);
    return insertResult.insertedId.toString();
  },

  async updateById(postId: string, dto: UpdatePostInputDTO): Promise<void> {
    const updateResult = await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $set: {
          title: dto.title,
          shortDescription: dto.shortDescription,
          content: dto.content,
          blogId: dto.blogId,
        },
      },
    );

    if (updateResult.matchedCount < 1) throw new RepositoryNotFoundError('Post does not exist');
    return;
  },

  async deleteById(postId: string): Promise<void> {
    const deleteResult = await postsCollection.deleteOne({ _id: new ObjectId(postId) });
    if (deleteResult.deletedCount < 1) throw new RepositoryNotFoundError('Post does not exist');
    return;
  },

  async deleteManyByIds(postsIds: ObjectId[]): Promise<number> {
    const result = await postsCollection.deleteMany({ _id: { $in: postsIds } });
    return result.deletedCount;
  },
};
