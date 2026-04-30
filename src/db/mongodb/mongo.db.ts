import { Collection, Db, MongoClient } from 'mongodb';
import { SETTINGS } from '../../core/settings/settings';
import { DriverType } from '../../drivers/types/driver.type';
import { RideType } from '../../rides/types/ride.type';

export let client: MongoClient;
export let driversCollection: Collection<DriverType>;
export let ridesCollection: Collection<RideType>;

/*Функция "runDB()" для подключения к серверу MongoDB.*/
export const runDB = async (url: string, dbName: string): Promise<void> => {
  /*Создаем клиента для MongoDB.*/
  client = new MongoClient(url);
  /*Указываем БД, к которой будет подключаться клиент для MongoDB.*/
  const db: Db = client.db(dbName);
  /*Создаем коллекции в указанной БД.*/
  driversCollection = db.collection<DriverType>(SETTINGS.DRIVERS_COLLECTION_NAME);
  ridesCollection = db.collection<RideType>(SETTINGS.RIDES_COLLECTION_NAME);

  try {
    /*Присоединяем клиента для MongoDB к серверу и проверяем соединение.*/
    await client.connect();
    await db.command({ ping: 1 });
    console.log('✅ Successfully connected to the MongoDB server');
  } catch (error) {
    await client.close();
    throw new Error(`❌ Cannot connect to the MongoDB server: ${error}`);
  }
};

/*Функция "stopDb()" для отключения от сервера MongoDB.*/
export const stopDb = async () => {
  if (!client) throw new Error(`❌ No MongoDB clients`);
  await client.close();
};
