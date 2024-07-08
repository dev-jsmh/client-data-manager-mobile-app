import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonLabel
} from '@ionic/angular/standalone';
import { SqliteService } from 'src/app/services/sqlite.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Client } from 'src/app/models/client';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-modify-client',
  templateUrl: './modify-client.page.html',
  styleUrls: ['./modify-client.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonButton,
    IonItem,
    IonLabel
  ]
})
export class ModifyClientPage implements OnInit {

  public id = "";
  public client: Client = new Client();
  public loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private database: DatabaseService

  ) {
    this.id = this.route.snapshot.params["id"];
    console.log(this.id);
    this.loadClient();
  }

  ngOnInit() {
  }

  // use from builder instate of formGroup. this way i could create a from when the data  it's been fetch from data base

  updateClientForm = new FormGroup(
    {
      "name": new FormControl(this.client.name, [Validators.required]),
      "lastName": new FormControl(this.client.lastName, [Validators.required]),
      "phone": new FormControl(this.client.phone, [Validators.required, Validators.minLength(10)]),
      "address": new FormControl(this.client.address, [Validators.required]),
      "neighborhood": new FormControl(this.client.neighborhood, [Validators.required]),
    }
  );

  // load desired client 
  public async loadClient() {
    // call the service to fetch the client from data base
    await this.database.getById(this.id).then((response) => {

      this.client.name = response.name;
      this.client.lastName = response.last_name;
      this.client.address = response.address;
      this.client.neighborhood = response.neighborhood;
      this.client.phone = response.phone;
      // set the new state to the loading variable
      this.loaded = true;
      console.log("------------ This is update form view ------------");
      for (var index = 0; Object.keys(response).length > index; index++) {
        console.log(Object.values(response)[index]);
      }

    }).catch(error => {
      Promise.reject(error);
      // log error message to the console
      console.error(error);
    });
  };

  public updateClient() {

    const data = new Client();

    data.name = this.updateClientForm.get("name")?.value;
    data.lastName = this.updateClientForm.get("lastName")?.value;
    data.address = this.updateClientForm.get("address")?.value;
    data.neighborhood = this.updateClientForm.get("neighborhood")?.value;
    data.phone = this.updateClientForm.get("phone")?.value;
    // call the service to execute the update operation
    this.database.updateById(this.id, data).then((response) => {
      console.log("client information update successfully.");
      console.log(response);
    }).catch(error => { Promise.reject(error) });

  };

  public goToClientDetails() {
    this.router.navigate(["home", this.id, "client-details"]);
  }
}
