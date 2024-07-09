import { Injectable } from '@angular/core';
// imports for sqlite
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection, capSQLiteChanges } from "@capacitor-community/sqlite";
import { Client } from '../models/client';
import { Device } from '@capacitor/device';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public DB_NAME = "businessManagementSystem";

  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  public dbReady: boolean = false;

  constructor() { }

  // initialize data base 
  async initializePlugins() {

    const info = await Device.getInfo();
    if (info.platform === "android") {

      try {
        const sqlite = CapacitorSQLite as any;
        sqlite.requestPermissions();
      } catch (e) {
        const alertError = {
          header: "No db access",
          message: "This app cannot work without permissions.",
          buttons: ['Ok']
        };

        console.warn(alertError);

        console.warn("This is the error: " + e);

      }

    }

    // create the conncetion to data base 
    this.db = await this.sqlite.createConnection(
      this.DB_NAME,
      false,
      "no-encryption",
      1,
      false);

    await this.db.open().then(() => {
      // set true when data
      this.dbReady = true;
      console.log("Data base open successfully !");
    }).catch(error => {
      console.log("Not posible to open the data base. try again.");
      Promise.reject(error)
    }
    );

    const schema = `CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        neighborhood TEXT NOT NULL
      )`;

    // create table if not exists
    await this.db.execute(schema).then(
      (changes: capSQLiteChanges) => {

        console.log("Table clients created successfully ! ");
        console.log(changes);
      }).catch(error => Promise.reject(error));


    // load all clients from data base
  }

  // query all client row 
  async loadClients() {
    try {
      // execute a query 
      const response = await CapacitorSQLite.query(
        {
          database: this.DB_NAME,
          statement: "SELECT * FROM clients",
          values: [],
        }
      );

      // set the got value to the signal of clients
      /* let clients = [
       {
         name: "Jhonatan Samuel",
         last_name: "Martinez Hernandez",
         address: "calle 34",
         neighborhood: "Los Caracoles",
         phone: "3135681002"

       },
       {
         name: "Maria Luisa",
         last_name: "Martinez Hernandez",
         address: "calle 34",
         neighborhood: "Los Caracoles",
         phone: "3227299602"

       },
       {
         name: "Daniel David",
         last_name: "Hoyos Mogollon",
         address: "Mz 57 L9 #32",
         neighborhood: "Los Caracoles",
         phone: "5500000005"

       }
     ];
     */
      let clients = [];

      for (var i = 0; response.values.length > i; i++) {
        const row = response.values[i];
        clients.push(row);
      }

      // return the array 
      return clients
    } catch (error) {
      return await Promise.reject(error)
    };

  }

  // ------ get all clients from data base
  async getAll() {
    // create a query
    const query = `SELECT * FROM clients`;
    // run the query 
    try {
      const rs = await this.db.query(query);

      /* let clients = [
        {
          name: "Jhonatan Samuel",
          last_name: "Martinez Hernandez",
          address: "calle 34",
          neighborhood: "Los Caracoles",
          phone: "3135681002"

        },
        {
          name: "Maria Luisa",
          last_name: "Martinez Hernandez",
          address: "calle 34",
          neighborhood: "Los Caracoles",
          phone: "3227299602"

        },
        {
          name: "Daniel David",
          last_name: "Hoyos Mogollon",
          address: "Mz 57 L9 #32",
          neighborhood: "Los Caracoles",
          phone: "5500000005"

        }
      ]; */
      let clients = [];

      for (var index = 0; index < rs.values.length; index++) {

        const obj = rs.values[index];
        clients.push(obj);
      }
      return clients;
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  // ------ get specified client by id
  // Fetch a specified row from the bata base by it id. return a value of type any. with the name of each colun from the table
  async getById(id: string) {

    const query = "SELECT * FROM clients WHERE id = ?"
    try {
      const response = await CapacitorSQLite.query({
        database: this.DB_NAME,
        statement: query,
        values: [id]
      });

      const obj = response.values[0];
      return obj;
    } catch (error) {
      return await Promise.reject(error);

    }
  }

  // ------ store information of a new client
  async save(data: any) {
    try {
      const query = `INSERT INTO clients ( name, last_name, address, neighborhood, phone ) values( '${data.name}' , '${data.lastName}' , '${data.address}' , '${data.neighborhood}' , '${data.phone}' ) `;
      // run the query
      const response = await this.db.execute(query);
      return response;
    }
    catch (error) {
      return await Promise.reject(error)
    };
  }
  // ------ Delete a client by id
  async delete(id: string) {

    await this.db.execute(`DELETE FROM clients WHERE id = ${id}`)
      .then((changes) => {
        console.log("Client with id " + id + " deleted successfully.");
        return changes;
      }).catch(reason => {
        Promise.reject(reason);
      });

  }

  // ------ update a client by id
  async updateById(id: string, data: Client) {
    const query = "UPDATE clients set name = ?, last_name = ?, address = ?, neighborhood = ?, phone = ? WHERE id = ?";
    try {
      const response = await CapacitorSQLite.run({
        database: this.DB_NAME,
        statement: query,
        values: [
          data.name,
          data.lastName,
          data.address,
          data.neighborhood,
          data.phone,
          id

        ]
      });
      return response
    } catch (error) {
      console.error(error);
      return await Promise.reject(error);
    }

  }

}
