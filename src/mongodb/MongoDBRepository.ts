import { Collection, Db, Document, MongoClient } from "mongodb";
import { MongoServerConfiguration } from "../configuration/mongoServerConfiguration";

export abstract class MongoRepository<T extends Document> {
    protected _collection: Collection | null = null;
    protected _client: MongoClient | null = null;
    protected _collectionName: string;
    protected _db: Db | null = null;

    protected logData: any = {}

    constructor(collectionName: string) {
        this._client = new MongoClient(MongoServerConfiguration.CONNECTION_STRING);
        this._collectionName = collectionName;

        // this.logData = {
        //     origin: this.constructor.name,
        //     collection: this._collectionName,
        // }
    }

    // * =================== PUBLIC METHODS =================== //

    public async insert (document: T): Promise<any> {
        if(!await this._isConnected()) return false;

        // this.logData.method = "insert";
        // this.logData.document = document;

        try {
            // logger.info(this.logData);

            return await this._collection!!.insertOne(document);
        } catch (err) {
            //this.logData.error = err;
            // logger.error(this.logData);

            return false;
        }
    }

    public async findAll(){
        return await this._findDocumentsByFilter({});
    }

    // * =================== PROTECTED METHODS =================== //

    protected async _isConnected(): Promise<boolean> {
        // console.log(this.constructor.name + " is connecting to MongoDB...");

        try
        {
            await this._client!!.connect();
            this._db = this._client!!.db(MongoServerConfiguration.DATABASE);
            this._collection = this._db!!.collection(this._collectionName);
            
            return true
        }
        catch(err)
        {
            console.log("Error connecting to MongoDB: " + err);
            // this.logData.method = "_isConnected";
            // this.logData.error = err;
            // logger.error(this.logData)

            return false;
        }
    }

     /**
     * 
     * @param filter Filter to use
     * @returns Users that match the filter or empty array if error
     */
    protected async _findDocumentsByFilter(filter: any, limit: number = 0): Promise<Array<any>> {
        if(!await this._isConnected()) return [];
        
        this.logData.method = "_findDocumentsByFilter";
        this.logData.filter = filter;

        try {
            // logger.info(this.logData);

            return await this._collection!!.find(filter as any).limit(limit).toArray();
        } catch (err) {
            this.logData.error = err;
            // logger.error(this.logData);

            return [];
        }
    }

    // ? =================== ABSTRACT METHODS =================== //

    abstract delete(id: string): Promise<any>;

}