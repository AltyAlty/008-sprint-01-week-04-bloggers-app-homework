import 'dotenv/config';
import express from 'express';
import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../../utils/auth/generate-admin-auth-token';
import { clearDb } from '../../utils/db/clear-db';
import { runDB, stopDb } from '../../../src/db/mongodb/mongo.db';
import { SETTINGS } from '../../../src/core/settings/settings';
import { createBlog } from '../../utils/blogs/create-blog';
import { getCreateBlogInputDTO } from '../../utils/blogs/get-create-blog-input-dto';
import { CreateBlogInputDTO } from '../../../src/blogs/routes/input-dto/create-blog.input-dto';
import { createPost } from '../../utils/posts/create-post';
import { getCreatePostInputDTO } from '../../utils/posts/get-create-post-input-dto';
import { getBlogById } from '../../utils/blogs/get-blog-by-id';
import { UpdateBlogInputDTO } from '../../../src/blogs/routes/input-dto/update-blog.input-dto';
import { BlogOutputDTO } from '../../../src/blogs/routes/output-dto/blog.output-dto';
import { CreatePostInputDTO } from '../../../src/posts/routes/input-dto/create-post.input-dto';

describe('Blogs API ID, body and auth validation checks', () => {
  const app = express();
  setupApp(app);
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL, SETTINGS.TEST_DB_NAME);
    await clearDb(app);
  });

  beforeEach(async () => await clearDb(app));

  afterAll(async () => await stopDb());

  it('❌ 001 should not return a list of blogs when incorrect pagination settings passed; GET /api/blogs', async () => {
    await Promise.all([createBlog(app), createBlog(app)]);
    const pageSize = 5;
    const pageNumber = 1;
    const sortDirection = 'asc';
    const sortBy = 'name';
    const incorrectPageSize = 101;
    const incorrectPageNumber = -1;
    const incorrectSortDirection = 'cas';
    const incorrectSortBy = 'shortDescription';

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}?pageSize=${incorrectPageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}?pageSize=${pageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${incorrectSortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    const getBlogsListResponse = await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getBlogsListResponse.body.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse.body.items.length).toBe(2);
    expect(getBlogsListResponse.body.totalCount).toBe(2);
  });

  it('❌ 002 should not create a blog without proper basic authorization; POST /api/blogs', async () => {
    await request(app).post(SETTINGS.BLOGS_PATH).send(getCreateBlogInputDTO()).expect(HttpStatus.Unauthorized_401);

    const getBlogsListResponse = await request(app)
      .get(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getBlogsListResponse.body.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse.body.items.length).toBe(0);
    expect(getBlogsListResponse.body.totalCount).toBe(0);
  });

  it('❌ 003 should not create a blog when incorrect body passed; POST /api/blogs', async () => {
    const correctBlogData: CreateBlogInputDTO = getCreateBlogInputDTO();

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({ name: '', description: correctBlogData.description, websiteUrl: correctBlogData.websiteUrl })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: '0123456789111111',
        description: correctBlogData.description,
        websiteUrl: correctBlogData.websiteUrl,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: '   ',
        description: correctBlogData.description,
        websiteUrl: correctBlogData.websiteUrl,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: '',
        websiteUrl: correctBlogData.websiteUrl,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: '   ',
        websiteUrl: correctBlogData.websiteUrl,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: null,
        websiteUrl: correctBlogData.websiteUrl,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: correctBlogData.description,
        websiteUrl: '',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: correctBlogData.description,
        websiteUrl: '   ',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .send({
        name: correctBlogData.name,
        description: correctBlogData.description,
        websiteUrl: 'www.websiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    const getBlogsListResponse = await request(app)
      .get(SETTINGS.BLOGS_PATH)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getBlogsListResponse.body.items).toBeInstanceOf(Array);
    expect(getBlogsListResponse.body.items.length).toBe(0);
    expect(getBlogsListResponse.body.totalCount).toBe(0);
  });

  it('❌ 004 should not return a list of posts for an existing blog specified by incorrect ID; GET /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    await Promise.all([createPost(app, undefined, createdBlogId), createPost(app, undefined, createdBlogId)]);
    const incorrectBlogId1 = '   ';
    const incorrectBlogId2 = null;
    const incorrectBlogId3 = 'ABC';
    const incorrectBlogId4 = 2;

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId1}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId2}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId3}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId4}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    const getPostsListByBlogIdResponse = await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getPostsListByBlogIdResponse.body.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.body.items.length).toBe(2);
    expect(getPostsListByBlogIdResponse.body.totalCount).toBe(2);
  });

  it('❌ 005 should not return a list of posts for an existing blog specified by ID when incorrect pagination settings passed; GET /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const pageSize = 5;
    const pageNumber = 1;
    const sortDirection = 'asc';
    const sortBy = 'title';
    const incorrectPageSize = 101;
    const incorrectPageNumber = -1;
    const incorrectSortDirection = 'cas';
    const incorrectSortBy = 'description';

    await Promise.all([
      createPost(app, undefined, createdBlogId),
      createPost(app, undefined, createdBlogId),
      createPost(app, undefined, createdBlogId),
      createPost(app, undefined, createdBlogId),
      createPost(app, undefined, createdBlogId),
      createPost(app, undefined, createdBlogId),
    ]);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${incorrectPageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${pageSize}&pageNumber=${incorrectPageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${incorrectSortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${incorrectSortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    const getPostsListByBlogIdResponse = await request(app)
      .get(
        `${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=${pageSize}&pageNumber=${pageNumber}&sortDirection=${sortDirection}&sortBy=${sortBy}`,
      )
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getPostsListByBlogIdResponse.body.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.body.items.length).toBe(5);
    expect(getPostsListByBlogIdResponse.body.totalCount).toBe(6);
  });

  it('❌ 006 should not create a post for an existing blog specified by ID without proper basic authorization; POST /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPostData: CreatePostInputDTO = getCreatePostInputDTO(createdBlogId);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .send(createdPostData)
      .expect(HttpStatus.Unauthorized_401);

    const getPostsListByBlogIdResponse = await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts?pageSize=5`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getPostsListByBlogIdResponse.body.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.body.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.body.totalCount).toBe(0);
  });

  it('❌ 007 should not create a post for an existing blog specified by incorrect ID; POST /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const createdPostData: CreatePostInputDTO = getCreatePostInputDTO(createdBlogId);
    const incorrectBlogId1 = '   ';
    const incorrectBlogId2 = null;
    const incorrectBlogId3 = 'ABC';
    const incorrectBlogId4 = 2;

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId1}/posts`)
      .set('Authorization', adminToken)
      .send(createdPostData)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId2}/posts`)
      .set('Authorization', adminToken)
      .send(createdPostData)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId3}/posts`)
      .set('Authorization', adminToken)
      .send(createdPostData)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId4}/posts`)
      .set('Authorization', adminToken)
      .send(createdPostData)
      .expect(HttpStatus.BadRequest_400);

    const getPostsListByBlogIdResponse = await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getPostsListByBlogIdResponse.body.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.body.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.body.totalCount).toBe(0);
  });

  it('❌ 008 should not create a post for an existing blog specified by ID when incorrect body passed; POST /api/blogs/:blogId/posts', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const correctPostData: CreatePostInputDTO = getCreatePostInputDTO(createdBlogId);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: '',
        shortDescription: correctPostData.shortDescription,
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: '0123456789012345678901234567890',
        shortDescription: correctPostData.shortDescription,
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: '   ',
        shortDescription: correctPostData.shortDescription,
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: '',
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: null,
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: '   ',
        content: correctPostData.content,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: correctPostData.shortDescription,
        content: '',
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: correctPostData.shortDescription,
        content: null,
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .post(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .send({
        title: correctPostData.title,
        shortDescription: correctPostData.shortDescription,
        content: '   ',
        blogId: createdBlogId,
      })
      .expect(HttpStatus.BadRequest_400);

    const getPostsListByBlogIdResponse = await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${createdBlogId}/posts`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.Ok_200);

    expect(getPostsListByBlogIdResponse.body.items).toBeInstanceOf(Array);
    expect(getPostsListByBlogIdResponse.body.items.length).toBe(0);
    expect(getPostsListByBlogIdResponse.body.totalCount).toBe(0);
  });

  it('❌ 009 should not return a blog specified by incorrect ID; GET /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const incorrectBlogId1 = null;
    const incorrectBlogId2 = 'ABC';
    const incorrectBlogId3 = 2;

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId1}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId2}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .get(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId3}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    const getBlogByIdResponse = await getBlogById(app, createdBlogId);
    expect(getBlogByIdResponse).toEqual({ ...createdBlog });
  });

  it('❌ 010 should not update a blog specified by ID without proper basic authorization; PUT /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    const updateBlogData: UpdateBlogInputDTO = {
      name: 'upd name 02',
      description: 'upd description 02',
      websiteUrl: 'https://www.updwebsiteurl01.com/blog-02',
    };

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .send(updateBlogData)
      .expect(HttpStatus.Unauthorized_401);

    const getBlogByIdResponse = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual({
      id: createdBlogId,
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('❌ 011 should not update a blog specified by incorrect ID; PUT /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const incorrectBlogId1 = null;
    const incorrectBlogId2 = 'ABC';
    const incorrectBlogId3 = 2;

    const updateBlogData: UpdateBlogInputDTO = {
      name: 'upd name 02',
      description: 'upd description 02',
      websiteUrl: 'https://www.updwebsiteurl01.com/blog-02',
    };

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId1}`)
      .set('Authorization', adminToken)
      .send(updateBlogData)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId2}`)
      .set('Authorization', adminToken)
      .send(updateBlogData)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId3}`)
      .set('Authorization', adminToken)
      .send(updateBlogData)
      .expect(HttpStatus.BadRequest_400);

    const getBlogByIdResponse = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual({
      id: createdBlogId,
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('❌ 012 should not update a blog specified by ID when incorrect body passed; PUT /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: '',
        description: 'upd description 01',
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: '   ',
        description: 'upd description 01',
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: '0123456789111111',
        description: 'upd description 01',
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: '',
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: '   ',
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: null,
        websiteUrl: 'https://www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: 'upd description 01',
        websiteUrl: '',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: 'upd description 01',
        websiteUrl: '   ',
      })
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .put(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`)
      .set('Authorization', adminToken)
      .send({
        name: 'upd name 01',
        description: 'upd description 01',
        websiteUrl: 'www.updwebsiteurl01.com/blog-01',
      })
      .expect(HttpStatus.BadRequest_400);

    const getBlogByIdResponse = await getBlogById(app, createdBlogId);

    expect(getBlogByIdResponse).toEqual({
      id: createdBlogId,
      name: createdBlog.name,
      description: createdBlog.description,
      websiteUrl: createdBlog.websiteUrl,
      createdAt: expect.any(String),
      isMembership: expect.any(Boolean),
    });
  });

  it('❌ 013 should not delete a blog specified by ID without proper basic authorization; DELETE /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    await request(app).delete(`${SETTINGS.BLOGS_PATH}/${createdBlogId}`).expect(HttpStatus.Unauthorized_401);
    const getBlogByIdResponse = await getBlogById(app, createdBlogId);
    expect(getBlogByIdResponse).toEqual({ ...createdBlog });
  });

  it('❌ 014 should not delete a blog specified by incorrect ID; DELETE /api/blogs/:id', async () => {
    const createdBlog: BlogOutputDTO = await createBlog(app);
    const createdBlogId: string = createdBlog.id;
    const incorrectBlogId1 = null;
    const incorrectBlogId2 = 'ABC';
    const incorrectBlogId3 = 2;

    await request(app)
      .delete(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId1}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .delete(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId2}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    await request(app)
      .delete(`${SETTINGS.BLOGS_PATH}/${incorrectBlogId3}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.BadRequest_400);

    const getBlogByIdResponse = await getBlogById(app, createdBlogId);
    expect(getBlogByIdResponse).toEqual({ ...createdBlog });
  });
});
