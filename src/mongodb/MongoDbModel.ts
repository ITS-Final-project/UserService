import { Document } from "mongodb";
import { v4 as uuid } from 'uuid';

export abstract class Model implements Document{
    public id: string = uuid();

    public created: Date;
    public updated: Date;

    constructor(created: Date, updated: Date) {
        this.created = created;
        this.updated = updated;
    }

    public updatedNow() {
        this.updated = new Date();
    }
}