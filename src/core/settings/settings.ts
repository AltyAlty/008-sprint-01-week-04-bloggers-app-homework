export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || '',

  BLOGS_PATH: '/api/blogs',
  POSTS_PATH: '/api/posts',
  TESTING_PATH: '/api/testing',

  DB_NAME: process.env.DB_NAME || '008-s-01-w-04-bloggers-app-hw',
  TEST_DB_NAME: process.env.DB_NAME || '008-s-01-w-04-bloggers-app-hw-test',

  BLOGS_COLLECTION_NAME: 'blogs',
  POSTS_COLLECTION_NAME: 'posts',

  BASIC_AUTH_ADMIN_USERNAME: process.env.BASIC_AUTH_ADMIN_USERNAME,
  BASIC_AUTH_ADMIN_PASSWORD: process.env.BASIC_AUTH_ADMIN_PASSWORD,
};
