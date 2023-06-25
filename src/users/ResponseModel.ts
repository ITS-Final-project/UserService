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