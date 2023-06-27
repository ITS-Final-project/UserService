import { v4 as uuid } from 'uuid';
import { Model } from '../mongodb/MongoDbModel';
import { Session } from '../session/Model';

export class User extends Model{

    public username: string;
    public email: string;
    public password: string;
    public roles: string[] = [];

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
    public roles: string[] = [];
    public session?: Session = {} as Session;

    constructor(id: string, username: string, email: string, roles: string[], session: Session) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
        this.session = session;
    }
}
