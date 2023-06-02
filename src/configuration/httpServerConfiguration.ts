import dotenv from 'dotenv';

dotenv.config({path:'.env'});

export class HttpConfiguration{
    public static PORT = process.env.PORT || 3001;
    public static HOST = process.env.HOST || 'http://localhost';
}