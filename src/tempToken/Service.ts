import { TempToken } from "./Model";
import { TempTokenRepository } from "./Repository";

export class TempTokenService {
    private static _instance: TempTokenService;

    private _tempTokenRepository: TempTokenRepository;

    private _collection = 'tempTokens';

    private constructor() {
        this._tempTokenRepository = new TempTokenRepository(this._collection);
    }

    public static getInstance(): TempTokenService {
        if (!TempTokenService._instance) {
            TempTokenService._instance = new TempTokenService();
        }

        return TempTokenService._instance;
    }

    private generateToken(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public async createTempToken(userId: string): Promise<TempToken> {
        return new Promise<TempToken>(async (resolve, reject) => {
            var existingToken = await this._tempTokenRepository.findByUserId(userId);

            // If token already exists, update it
            if (existingToken) {
                existingToken.updated = new Date();
                existingToken.token = this.generateToken();

                await this._tempTokenRepository.update(existingToken).then((tempToken) => {
                    console.log("Updated tempToken");
                    resolve(existingToken);
                }).catch((err) => {
                    reject(err);
                });

                return;
            }

            var tempToken = new TempToken(userId, new Date(), new Date());
            this._tempTokenRepository.insert(tempToken).then((tempToken) => {
                resolve(tempToken);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async deleteTempToken(token: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            var tempToken = await this._tempTokenRepository.findByToken(token);

            if (!tempToken) {
                reject('TempToken not found');
                return;
            }

            this._tempTokenRepository.delete(tempToken.id).then((ack) => {
                resolve(ack);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async updateTempToken(token: string): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            var tempToken = await this._tempTokenRepository.findByToken(token);

            if (!tempToken) {
                reject('TempToken not found');
                return;
            }

            tempToken.updated = new Date();

            this._tempTokenRepository.update(tempToken).then((tempToken) => {
                resolve(tempToken);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    public async verifyTempToken(token: string): Promise<TempToken> {
        return new Promise<TempToken>(async (resolve, reject) => {
            var tempToken = await this._tempTokenRepository.findByToken(token);

            if (!tempToken) {
                reject('TempToken not found');
                return;
            }

            tempToken.updated = new Date();
            tempToken.token = this.generateToken();

            this._tempTokenRepository.update(tempToken).then((tempToken) => {
                resolve(tempToken);
            }).catch((err) => {
                reject(err);
            });

        });
    }
}