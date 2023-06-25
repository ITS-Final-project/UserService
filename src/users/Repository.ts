import { MongoRepository } from "../mongodb/MongoDBRepository";
import { User } from "./Model";

export class UserRepository extends MongoRepository<User> {

    async delete(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    async findById(id: string): Promise<User> {
        return (await this._findDocumentsByFilter({id: id})).at(0);
    }

    async findByUsername(username: string): Promise<User> {
        return (await this._findDocumentsByFilter({username: username})).at(0);
    }

    async findByEmail(email: string): Promise<User> {
        return (await this._findDocumentsByFilter({email: email})).at(0);
    }
}