import { MongoRepository } from "../mongodb/MongoDBRepository";
import { TempToken } from "./Model";

export class TempTokenRepository extends MongoRepository<TempToken> {
    
    async findById(id: string): Promise<TempToken> {
        return (await this._findDocumentsByFilter({id: id})).at(0);
    }

    async findByToken(token: string): Promise<TempToken> {
        return (await this._findDocumentsByFilter({token: token})).at(0);
    }

    async findByUserId(userId: string): Promise<TempToken> {
        return (await this._findDocumentsByFilter({userId: userId})).at(0);
    }
}