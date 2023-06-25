import { v4 as uuid } from 'uuid';
import { Model } from '../mongodb/MongoDbModel';

export class User extends Model{

    public username: string;
    public email: string;
    public password: string;
    public roles: string[] = [];
    public session: UserSession | null = null;

    constructor(username: string, email: string, password: string, roles: string[], created: Date, updated: Date) {
        super(created, updated);
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }
}

export class UserResponse {
    public id: string;

    public username: string;
    public email: string;
    public session: any = {};
    public roles: string[] = [];

    constructor(id: string, username: string, email: string, roles: string[], session: any) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.session = session;
        this.roles = roles;
    }
}

export class UserSession {
    public id: string = uuid();
    public token: string = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    public validFrom: Date;
    public validHours: number;
    public validTo: Date;

    constructor(validFrom: Date, validHours: number) {
        this.validFrom = validFrom;
        this.validHours = validHours;

        this.validTo = new Date(validFrom.getTime() + (validHours * 60 * 60 * 1000));
    }
}