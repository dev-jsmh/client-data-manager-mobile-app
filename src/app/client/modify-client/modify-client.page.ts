import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonLabel,
  IonInput
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
    IonLabel,
    IonInput
  ]
})
export class ModifyClientPage implements OnInit {

  public id = "";
  public client: Client = new Client();
  public loaded: boolean = false;

  public updateClientForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private database: DatabaseService

  ) {
    this.id = this.route.snapshot.params["id"];
    console.log(this.id);
    
  }

  ngOnInit() {
  };

  ionViewWillEnter() {
    console.log(this.id);
    this.loadClient();
  };

  // use from builder instate of formGroup. this way i could create a from when the data  it's been fetch from data base
  /*
    updateClientForm = new FormGroup(
      {
        "name": new FormControl("", [Validators.required]),
        "lastName": new FormControl("", [Validators.required]),
        "phone": new FormControl("", [Validators.required, Validators.minLength(10)]),
        "address": new FormControl("", [Validators.required]),
        "neighborhood": new FormControl("", [Validators.required]),
      }
    );*/

  // load desired client 
  public async loadClient() {
    // call the service to fetch the client from data base
    await this.database.getById(this.id).then((response) => {

      this.client.name = response.name;
      this.client.lastName = response.last_name;
      this.client.address = response.address;
      this.client.neighborhood = response.neighborhood;
      this.client.phone = response.phone;


      // set old values from client to from so they can ve modify

      this.updateClientForm = this.fb.group({
        name: [response.name, Validators.required],
        lastName: [response.last_name, Validators.required],
        address: [response.address, Validators.required],
        neighborhood: [response.neighborhood, Validators.required],
        phone: [response.phone, Validators.required]


      });

      this.updateClientForm.dirty


      console.log("------------ This is update form view ------------");
      for (var index = 0; Object.keys(response).length > index; index++) {
        console.log(Object.values(response)[index]);
      }
      // set the new state to the loading variable
      this.loaded = true;

    }).catch(error => {
      Promise.reject(error);
      // log error message to the console
      console.error(error);
    });
  };

  public submitData() {

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
      // redirect the user to home page
      this.router.navigate(["home", this.id, "client-details"]);
    }).catch(error => { Promise.reject(error) });

  };

  public goToClientDetails() {
    this.router.navigate(["home", this.id, "client-details"]);
  }
}
