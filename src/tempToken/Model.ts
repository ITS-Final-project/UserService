import {v4} from 'uuid';
import { Model } from '../mongodb/MongoDbModel';

export class TempToken extends Model {
    public token: string; 
    public userId: string;

    constructor(userId: string, created: Date, updated: Date) {
        super(created, updated);
        this.token = v4();
        this.userId = userId;
    }
    
}