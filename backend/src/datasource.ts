import { DataSource } from 'typeorm';
import 'dotenv/config';

 export const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: false,
    logging: true,
    entities: [__dirname + '/entities/*.entity.ts'],
    migrations: [__dirname + '/migrations/*.ts'],
    migrationsTableName: "migration",
    extra: {
      connectionLimit: 10,
      queueLimit: 0,
    },
  });

  dataSource.initialize()
  .then(() => {
      console.log("Data Source has been initialized!")
  })
  .catch((err) => {
      console.error("Error during Data Source initialization", err)
  })