import { JwtPayload } from "jsonwebtoken";
import { User, UserSession } from "./Model";
import { UserRepository } from "./Repository";

export class UserService{
    private static _instance: UserService;
    private static _repository: UserRepository

    private _collection = 'users';

    private constructor(){
        UserService._repository = new UserRepository(this._collection);
    }

    public static getInstance(): UserService{
        if(!UserService._instance){
            UserService._instance = new UserService();
        }
        return UserService._instance;
    }

    public async login(usernameOrEmail: string, password: string): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            // Check if user can be found by username
            var user = await UserService._repository.findByUsername(usernameOrEmail);
            if(!user){
                // If not, check if user can be found by email
                user = await UserService._repository.findByEmail(usernameOrEmail);

                if(!user){
                    reject('User not found');
                    return;
                }
            }

            // Todo: hash password
            if(user.password != password){
                reject('Invalid password');
                return;
            }

            this.updateSession(user, new UserSession(new Date(), 1)).then((ack) => {
                if (!ack.acknowledged) {
                    reject('Could not update session');
                    return;
                }
                resolve(user);
            }).catch((err) => {
                reject(err);
            });

        });
    }

    public async register(user: User): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            var foundByUsername = await UserService._repository.findByUsername(user.username);

            if(foundByUsername){
                reject({message: 'Username already exists', badFields: ['username'], status: 1});
                return;
            }

            var foundByEmail = await UserService._repository.findByEmail(user.email);

            if(foundByEmail){
                reject({message: 'Email already exists', badFields: ['email'], status: 1});
                return;
            }

            UserService._repository.insert(user).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject({message: 'Could not register user', badFields: ['username', 'email', 'password'], status: 2});
            });
        });
    }

    public async checkSession(data: JwtPayload): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            var user = await UserService._repository.findById(data.user.id);

            if(!user){
                reject('User not found');
                return;
            }

            if(!user.session || !user.session.token || user.session.token != data.user.session?.token){
                reject('Invalid session');
                return;
            }

            if(user.session.validTo < new Date()){
                reject('Session expired');
                return;
            }

            resolve(user);
        });
    }

    public async logout(user: User): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            user.session = null;
            UserService._repository.update(user).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public updateSession(user: User, session: UserSession): Promise<any> {
        return new Promise<User>(async (resolve, reject) => {
            user.session = session;
            UserService._repository.update(user).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

}