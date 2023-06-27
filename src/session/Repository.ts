import { MongoRepository } from "../mongodb/MongoDBRepository";
import { Session } from "./Model";

export class SessionRepository extends MongoRepository<Session> {

    async deleteByUserId(userId: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            try{
                var session = await this.findByUserId(userId);
            }catch(err){
                reject("Internal server error");
                return;
            }

            if(!session){
                reject('Session not found');
                return;
            }

            this.delete(session.id).then((ack) => {
                resolve(ack);
            }).catch((err) => {
                reject(err);
            });
        });
    }
    
    async findById(id: string): Promise<Session> {
        return (await this._findDocumentsByFilter({id: id})).at(0);
    }

    async findByUserId(userId: string): Promise<Session> {
        return (await this._findDocumentsByFilter({userId: userId})).at(0);
    }
}