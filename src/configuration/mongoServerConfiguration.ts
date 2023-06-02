import dotenv from 'dotenv';

dotenv.config({path:'.env'});

export class MongoServerConfiguration {
    HOST = process.env.MONGO_HOST || 'mongodb://localhost';
    PORT = process.env.MONGO_PORT || 27017;
    DB = process.env.MONGO_DB || 'zr_users';
}
    