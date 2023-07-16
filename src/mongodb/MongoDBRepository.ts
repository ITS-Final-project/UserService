import { Collection, Db, Document, MongoClient } from "mongodb";
import { MongoServerConfiguration } from "../configuration/mongoServerConfiguration";
import { Model } from "./MongoDbModel";

interface IMongoRepository<T extends Model> {
    insert(document: T): Promise<any>;
    update(document: T): Promise<any>;
    delete(id: string): Promise<any>;
    findAll(): Promise<Array<T>>;
}

interface IMongoRepositoryFilter<T extends Model> {
    findDocumentsByFilter(filter: any, pagesize: number, pagenumber: number): Promise<Array<T>>;
}

export abstract class MongoRepository<T extends Model> implements IMongoRepository<T>, IMongoRepositoryFilter<T> {
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

        // Sanitize document
        


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

    public async update(document: T): Promise<any> {
        if(!await this._isConnected()) return false;

        // this.logData.method = "update";
        // this.logData.document = document;

        try {
            // logger.info(this.logData);
            document.updated = new Date();
            return await this._collection!!.updateOne({ id: document.id }, { $set: document });
        } catch (err) {

            console.log("Error updating document: " + err);
            // this.logData.error = err;
            // logger.error(this.logData);


            return false;
        }
    }

    public async findAll(){
        return await this._findDocumentsByFilter({});
    }

    public async delete(id: string): Promise<any> {
        if (!await this._isConnected()) return false;

        this.logData.method = "delete";
        this.logData.id = id;

        try {
            // logger.info(this.logData);

            return await this._collection!!.deleteOne({ id: id });
        }catch (err) {
            this.logData.error = err;
            // logger.error(this.logData);

            return false;
        }
    }

    public findDocumentsByFilter(filter: any, limit: number = 0): Promise<Array<T>> {
        return this._findDocumentsByFilter(filter, limit);
    }

    public async count(filter: any): Promise<number> {
        if (!await this._isConnected()) return 0;

        this.logData.method = "count";
        this.logData.filter = filter;

        try {
            // logger.info(this.logData);

            return await this._collection!!.countDocuments(filter);
        } catch (err) {
            this.logData.error = err;
            // logger.error(this.logData);

            return 0;
        }
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
            console.log(" - Connection string: " + MongoServerConfiguration.CONNECTION_STRING);
            console.log(" - Database: " + MongoServerConfiguration.DATABASE);
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
    protected async _findDocumentsByFilter(filter: any, pagesize: number = 0, pagenumber: number = 0): Promise<Array<any>> {
        if(!await this._isConnected()) return [];
        
        this.logData.method = "_findDocumentsByFilter";
        this.logData.filter = filter;

        try {
            // logger.info(this.logData);
            // return await this._collection!!.find(filter as any).limit(pagesize).toArray();
            pagenumber = parseInt(pagenumber.toString());
            pagesize = parseInt(pagesize.toString());
            
            return await this._collection!!.find(filter as any).skip(pagenumber * pagesize).limit(pagesize).toArray();
        } catch (err) {
            this.logData.error = err;
            // logger.error(this.logData);

            return [];
        }
    }

    

}