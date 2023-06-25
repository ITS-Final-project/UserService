import { v4 as uuid } from 'uuid';
import { Model } from '../mongodb/MongoDbModel';

export class User extends Model{

    public username: string;
    public email: string;
    public password: string;
    public role: string;
    public session: UserSession | null = null;

    constructor(username: string, email: string, password: string, role: string, created: Date, updated: Date) {
        super(created, updated);
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

export class UserResponse {
    public id: string;

    public username: string;
    public email: string;
    public session: any = {};

    constructor(id: string, username: string, email: string, session: any) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.session = session;
    }
}

export class UserSession {
    public id: string;
    public token: string;
    public validFrom: Date;
    public validHours: number;
    public validTo: Date;

    constructor(id: string = "", token: string, validFrom: Date, validHours: number) {
        this.id = id == "" ? uuid() : id;
        this.token = token;
        this.validFrom = validFrom;
        this.validHours = validHours;

        this.validTo = new Date(validFrom.getTime() + (validHours * 60 * 60 * 1000));
    }
}