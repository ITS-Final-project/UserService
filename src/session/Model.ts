import { Model } from '../mongodb/MongoDbModel';

export class Session extends Model {
    
    public token: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    public userId: string;
    public validFrom: Date;
    public validHours: number;
    public validTo: Date;

    constructor(userId: string, validFrom: Date, validHours: number) {
        super(new Date(), new Date());

        this.userId = userId;
        this.validFrom = validFrom;
        this.validHours = validHours;

        this.validTo = new Date(validFrom.getTime() + (validHours * 60 * 60 * 1000));
    }
}
