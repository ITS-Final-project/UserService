import { User } from "./Model";
import { UserRepository } from "./Repository";

export class UserService{
    private static _instance: UserService;
    private static _repository: UserRepository

    private _collection = 'users';

    private constructor(){
        UserService._repository = new UserRepository(this._collection);
    }

    public async getRegistrationStats(): Promise<any> {
        // Get number of users registered per month for the last 6 months
        var now = new Date();
        var sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 6);

        var filter = {
            created: {
                $gte: sixMonthsAgo,
                $lte: now
            }
        };

        var users = await UserService._repository.search(filter, 0, 0);
        var stats = {} as any;

        users.forEach((user) => {
            var month = user.created.getMonth();
            if(!stats[month]){
                stats[month] = 0;
            }

            stats[month] += 1;
        });

        return stats;
    }

    public async checkPassword(id: string, password: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            var user = await UserService._repository.findById(id);
            if(!user){
                reject('User not found');
                return;
            }

            if(user.password != password){
                reject('Invalid password');
                return;
            }

            resolve(true);
        });
    }

    public async findById(id: string): Promise<User> {
        return await UserService._repository.findById(id);
    }

    public static getInstance(): UserService{
        if(!UserService._instance){
            UserService._instance = new UserService();
        }
        return UserService._instance;
    }

    public async edit(id: string, username?: string, email?: string, newPassword?: string, roles?: string[]){
        return new Promise<User>(async (resolve, reject) => {
            var user = await UserService._repository.findById(id);

            if(!user){
                reject('User not found');
                return;
            }

            console.log(username)

            if (username && user.username != username) {
                var foundByUsername = await UserService._repository.findByUsername(username);

                if (foundByUsername) {
                    reject('Username already exists');
                    return;
                }

                user.username = username;
            }

            if (email && user.email != email) {
                var foundByEmail = await UserService._repository.findByEmail(email);

                if (foundByEmail) {
                    reject('Email already exists');
                    return;
                }

                user.email = email;
            }

            // Todo: hash password
            if (newPassword) {
                user.password = newPassword;
            }

            if (roles) {
                user.roles = roles;
            }

            var userObj = new User(user.username, user.email, user.password, user.roles, user.created, new Date());
            userObj.id = user.id;

            console.log(userObj)

            this.update(userObj).then((user) => {
                resolve(userObj);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async update(user: User): Promise<User> {
        return new Promise<User>(async (resolve, reject) => {
            UserService._repository.update(user).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async delete(id: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            UserService._repository.delete(id).then((result) => {
                resolve(result);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async count(username: string, email: string, roles: string[]): Promise<number> {
        return new Promise<number>(async (resolve, reject) => {
            var filter = {} as any;
            if(username){
                filter['username'] = username;
            }

            if(email){
                filter['email'] = email;
            }

            if(roles){
                filter['roles'] = roles;
            }

            UserService._repository.count(filter).then((count) => {
                resolve(count);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async search(username: string, email: string, roles: string[], pagesize: number, pagenumber: number): Promise<User[]> {
        return new Promise<User[]>(async (resolve, reject) => {
            var filter = {} as any;
            if(username){
                filter['username'] = username;
            }
            if(email){
                filter['email'] = email;
            }
            if(roles){
                filter['roles'] = {$all: roles};
            }

            UserService._repository.search(filter, pagesize, pagenumber)
            .then((users) => {
                users.forEach((user) => {
                    user.password = '';
                });
                resolve(users);
            }).catch((err) => {
                reject(err);
            });
        });
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

            resolve(user);
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

    public async checkRole(userId: string, role: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            var user = await UserService._repository.findById(userId);
            if(!user){
                reject('User not found');
                return;
            }

            if(!user.roles.includes(role)){
                reject('User does not have role');
                return;
            }

            resolve(true);
        });
    }
}