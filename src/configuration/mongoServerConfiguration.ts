import dotenv from 'dotenv';

dotenv.config({path:'.env'});

export class MongoServerConfiguration {
    public static HOST = process.env.DB_HOST || 'localhost';
    public static PORT = process.env.DB_PORT || 27017;
    public static DATABASE = process.env.DB_NAME || 'zr_users';
    public static USER = process.env.READERWRITER_USERNAME
    public static PASSWORD = process.env.READERWRITER_PASSWORD
    public static CONNECTION_STRING = "mongodb://" 
        + MongoServerConfiguration.USER + ":" + MongoServerConfiguration.PASSWORD 
        + "@" + MongoServerConfiguration.HOST + ":" + MongoServerConfiguration.PORT 
        + "/" + MongoServerConfiguration.DATABASE;
}
    