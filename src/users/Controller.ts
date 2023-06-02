import { UserRepository } from './Repository';

export class UserController {
    private static _instance: UserController;

    private _collection = 'users';
    private _repository: UserRepository;

    private constructor() {
        this._repository = new UserRepository(this._collection);
    }

    public static getInstance(): UserController {
        if (!this._instance) {
            this._instance = new UserController();
        }

        return this._instance;
    }

    public async findAll() {
        return await this._repository.findAll();
    }

    public async insert(user: any) {
        return await this._repository.insert(user);
    }

    public async delete(id: string) {
        return await this._repository.delete(id);
    }

    public async findById(id: string) {
        return await this._repository.findById(id);
    }

}