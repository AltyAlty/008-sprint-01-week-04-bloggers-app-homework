export const SETTINGS = {
  PORT: process.env.PORT || 5003,
  MONGO_URL: process.env.MONGO_URL || '',

  DRIVERS_PATH: '/api/drivers',
  RIDES_PATH: '/api/rides',
  TESTING_PATH: '/api/testing',

  DB_NAME: process.env.DB_NAME || '008-s-01-w-04-bloggers-app-hw',
  TEST_DB_NAME: process.env.DB_NAME || '008-s-01-w-04-bloggers-app-hw-test',

  DRIVERS_COLLECTION_NAME: 'drivers',
  RIDES_COLLECTION_NAME: 'rides',

  BASIC_AUTH_ADMIN_USERNAME: process.env.BASIC_AUTH_ADMIN_USERNAME,
  BASIC_AUTH_ADMIN_PASSWORD: process.env.BASIC_AUTH_ADMIN_PASSWORD,
};
