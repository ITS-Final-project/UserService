import fs, { PathLike } from "fs";
import path from "path";
import _ from "lodash";

export class LogRepository {
    private filePath: PathLike;

    constructor(filePath: PathLike) {
        this.filePath = filePath;
    }

    findLogValueByLevel(name: string, level: string){
        return this.findLogValueByFilter(name, {level: level.toUpperCase()});
    }

    findLogValueByDate(name: string, date: Date){
        return this.findLogValueByFilter(name, {date: date});
    }

    findLogValueByAction(name: string, action: string){
        return this.findLogValueByFilter(name, {action: action});
    }

    async findLogValueByFilter(name: string, filter: any){
        // Await for log file to be read
        var log = await this.findLogValueByFileName(name);

        // Makes a filter for the log file
        // Filter is case insensitive, and is a partial match
        var filteredData =  _.filter(log, (item) => {
                                return Object.keys(filter).every((key) => {
                                    if(item.hasOwnProperty(key))
                                        return item[key].toLowerCase().includes(filter[key].toLowerCase());
                                });
                            });

        return filteredData;
    }

    findAllLogFiles(){
        // Read all files in the directory
        try{
            return fs.readdirSync(this.filePath);
        }catch(err){
            console.log(err);

            return null;
        }
    }

    async findLogValueByFileName(name: string){
        // Await for log file to be read and parsed to JSON
        try{
            var data = fs.readFileSync(path.join(this.filePath.toString(), this._parseName(name)));
            return JSON.parse(data.toString());
        }catch(err){
            console.log(err);

            return null;
        }
    }

    deleteLogFileByName(name: string){
        // Delete log file
        try{
            fs.unlinkSync(path.join(this.filePath.toString(), this._parseName(name)));

            return true;
        }catch(err){
            console.log(err);

            return false;
        }
    }

    

    // ! =================== Private Methods =================== //

    private _parseName(name: string){
        return name.endsWith(".json") ? name : name + ".json";
    }
}