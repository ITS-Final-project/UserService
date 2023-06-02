import { MongoRepository } from "../mongodb/MongoDBRepository";
import { User } from "./Model";

export class UserRepository extends MongoRepository<User> {

    async delete(id: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    async findById(id: string): Promise<any> {
        return await this._findDocumentsByFilter({id: id});
    }
}