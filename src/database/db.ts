import Dexie, { Table } from 'dexie';
import { Account, Gameworld } from './DatabaseTypes';

export class TravianJsDatabase extends Dexie {
    gameworlds!: Table<Gameworld>
    accounts!: Table<Account>
   
    constructor() {
        super('travianjs');
        this.version(3).stores({
            gameworlds: '++id, name, subtitle',
            accounts: '++id, gameworldId'
        });
    }
}

export const db = new TravianJsDatabase();