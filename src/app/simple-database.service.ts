import { Injectable } from '@angular/core';
import { Client } from './models/client';

@Injectable({
  providedIn: 'root'
})
export class SimpleDatabaseService {

public clientsArray: Client[] = [];

  constructor() { }

getAllClients(){
  return this.clientsArray;
}

saveClient(data: Client){

  this.clientsArray.push(data);

}

}
