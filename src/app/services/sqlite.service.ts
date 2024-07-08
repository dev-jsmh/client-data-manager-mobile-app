import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CapacitorSQLite, capSQLiteChanges, capSQLiteValues } from '@capacitor-community/sqlite';
import { Device } from '@capacitor/device';
import { Preferences } from '@capacitor/preferences';
import { JsonSQLite } from 'jeep-sqlite/dist/types/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs';
import { Client } from '../models/client';
import { CapacitorCookies } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  public dbReady: BehaviorSubject<boolean>;
  public isWeb: boolean = false;
  public isIos: boolean = false;
  public isAndroid: boolean = false;
  public dbName: string = "";

  constructor(
    private http: HttpClient
  ) {
    this.dbReady = new BehaviorSubject(false);
  }

  // initialize the service 
  async init() {
    const sqlite = CapacitorSQLite as any;
    // get device information 
    const info = await Device.getInfo();

    if (info.platform == "android") {
      this.isAndroid = true;
      try {
        await sqlite.requestPermissions();
      } catch (error) {
        console.error("Esta app necesita permisos para funcinar correctamente. ");
      }
    } else if (info.platform == "web") {
      this.isWeb = true;
      await sqlite.initWebStore();
    } else if (info.platform == "ios") {
      this.isIos = true;
    }

    // initialize data base
    this.setUpDataBase();
  }

  public async setUpDataBase() {

    const dbSetup = await Preferences.get({ key: 'first_setup_key' });

    if (!dbSetup.value) {
      this.downLoadDatabase();
    } else {
      this.dbName = await this.getDbName();
      await CapacitorSQLite.createConnection({ database: this.dbName });
      await CapacitorSQLite.open({ database: this.dbName });
      this.dbReady.next(true);
      console.log("data base id ready and open.....")
      

    };
  }

  public downLoadDatabase() {
    this.http.get('assets/db/db.json').subscribe(
      // execute async function 
      async (jsonExport: JsonSQLite) => {

        const jsonstring = JSON.stringify(jsonExport);
        const isValid = await CapacitorSQLite.isJsonValid({ jsonstring });


        if (isValid.result) {
          this.dbName = jsonExport.database;
          // create conection to data base 
          await CapacitorSQLite.importFromJson({ jsonstring });
          await CapacitorSQLite.createConnection({ database: this.dbName });
          await CapacitorSQLite.open({ database: this.dbName });

          await Preferences.set({ key: 'first_setup_key', value: '1' });

          await Preferences.set({ key: 'dbName', value: this.dbName });

          this.dbReady.next(true);

        }


      }
    );
  }

  // -------- get data base name --------
  async getDbName() {
    if (!this.dbName) {
      const dbName = await Preferences.get({ key: 'dbName' });
      if (dbName.value) {
        this.dbName = dbName.value
      }
    }
    return this.dbName;
  }




  // -------------------- CRUD OPERATIONS --------------------
  // get a string as a parameter 
  public async create(client: Client) {
    // query 
    let sql = "INSERT INTO clients (name, last_names, address, neighborhood, phone) values (?,?,?,?,?)";
    const dbName = await this.getDbName();

    CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: sql,
          values: [
            client.name,
            client.lastName,
            client.address,
            client.neighborhood,
            client.phone]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      if (this.isWeb) {
        CapacitorSQLite.saveToStore({ database: dbName });
      }
      else if (this.isAndroid) {
        CapacitorSQLite.saveToLocalDisk({ database: dbName });
      };

      return changes;
      // handle and return the enerated error
    }).catch(error => { Promise.reject(error) });

  };

  // returns an array of clients
  public async read() {
    let sql = "SELECT * FROM clients";
    const dbName = await this.getDbName();
    // execute the query 
    return CapacitorSQLite.query({
      database: dbName,
      statement: sql,
      values: []
    }).then((response: capSQLiteValues) => {
      // create and array of strings for the name
      let clients: Client[] = [];
      if (this.isIos && response.values.length > 0) {
        response.values.shift();
      }
      // loop throut the array of objects 
      for (var i = 0; response.values.length > i; i++) {
        // extract each client
        const objClient = response.values[i];
        // push the client to the new array
        clients.push(objClient);
      }
      // return the result 
      return clients;
    }).catch(error => { Promise.reject(error) });
  };

  public async getClientById(id: string) {

    let query = "SELECT * FROM clients WHERE id = ?";
    const dbName = await this.getDbName();
    return CapacitorSQLite.query({
      database: dbName,
      statement: query,
      values: [id]
    }
    ).then((response: capSQLiteValues) => {
      const objClient = response.values[0];
      return objClient
    }).catch((error) => {
      Promise.reject(error);
    });
  };

  public async delete(id: string) {
    let query = "DELETE FROM clients WHERE id = ?";
    const dbName = await this.getDbName();
    // run the query 
    CapacitorSQLite.executeSet({
      database: dbName,
      set: [
        {
          statement: query,
          values: [id]
        }
      ]
    }).then((changes: capSQLiteChanges) => {
      return changes;
    }).catch(error => { Promise.reject(error) });

  }

}
