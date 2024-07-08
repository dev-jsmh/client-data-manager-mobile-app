import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton,
  IonLabel,
  IonInput,
  IonItem
} from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { SqliteService } from 'src/app/services/sqlite.service';
import { Client } from 'src/app/models/client';

@Component({
  selector: 'app-create-new-client',
  templateUrl: './create-new-client.page.html',
  styleUrls: ['./create-new-client.page.scss'],
  standalone: true,
  imports: [
    RouterLink,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
    IonInput,
    IonItem
  ]
})
export class CreateNewClientPage implements OnInit {

  constructor(
    private router: Router, 
    private sqlite: SqliteService, 
    private database: DatabaseService) { }

  ngOnInit() {
  }

  // form to register data for a new client

  public registerClient = new FormGroup(
    {
      "name": new FormControl("", [Validators.required]),
      "lastName": new FormControl("", [Validators.required]),
      "phone": new FormControl("", [Validators.required, Validators.minLength(10)]),
      "address": new FormControl("", [Validators.required]),
      "neighborhood": new FormControl("", [Validators.required]),
    }
  );

  // ------- create client -----
  async saveClient() {
    const objClient = new Client();
    // assing values from the from to the client object
    objClient.name =  this.registerClient.get("name")?.value;
    objClient.lastName =  this.registerClient.get("lastName")?.value;
    objClient.address =  this.registerClient.get("address")?.value;
    objClient.neighborhood =  this.registerClient.get("neighborhood")?.value;
    objClient.phone =  this.registerClient.get("phone")?.value;
    /* wait for the operation to be executed
    await this.sqlite.create(objClient).then((changes) => {
      console.log("Generated changes by the operation: ..")
      console.log(changes);
    // redirect to the dashboard view 
    this.router.navigateByUrl("home");
      
    }).catch((error) => {
      console.error(error);
    });*/

    await this.database.save( objClient ).then( ( changes ) => {
      console.log("new client insert into the data base.......")
      console.log(changes);
    // redirect to the dashboard view 
    this.router.navigateByUrl("home");
    }).catch( ( error ) => {
      console.error( error );
    });

  };

}
