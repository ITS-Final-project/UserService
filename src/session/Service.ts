import { JwtPayload } from "jsonwebtoken";
import { Session } from "./Model";
import { SessionRepository } from "./Repository";

export class SessionService{
    private static _instance: SessionService;
    private static _repository: SessionRepository;

    private _collection = 'sessions';

    private constructor(){
        SessionService._repository = new SessionRepository(this._collection);
    }

    public static getInstance(): SessionService{
        if(!SessionService._instance){
            SessionService._instance = new SessionService();
        }
        return SessionService._instance;
    }

    public async createSession(userId: string, validHours: number): Promise<Session> {
        return new Promise<Session>(async (resolve, reject) => {
            var oldSession = await SessionService._repository.findByUserId(userId);

            if (oldSession) {
                SessionService._repository.delete(oldSession.id);
            }

            var session = new Session(userId, new Date(), validHours);
            SessionService._repository.insert(session).then((ack) => {
                resolve(session);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async verifySession(data: JwtPayload): Promise<Session> {
        return new Promise<Session>(async (resolve, reject) => {
            try{
                var session = await SessionService._repository.findById(data.user.session.id);
            }catch(err){
                reject("Internal server error");
                return;
            }

            if(!session){
                reject('Session not found');
                return;
            }

            if(session.token != data.user.session.token){
                reject('Invalid session');
                return;
            }

            if(session.validTo < new Date()){
                reject('Session expired');
                return;
            }

            resolve(session);
        });
    }

    public async deleteSessionBySessionId(id: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            SessionService._repository.deleteByUserId(id).then((ack) => {
                resolve(ack);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async deleteSessionByUserId(userId: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            SessionService._repository.deleteByUserId(userId).then((ack) => {
                resolve(ack);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // public async logout(user: User): Promise<any> {
    //     return new Promise<any>(async (resolve, reject) => {
    //         user.session = null;
    //         SessionService._repository.update(user).then((user) => {
    //             resolve(user);
    //         }).catch((err) => {
    //             reject(err);
    //         });
    //     });
    // }

}