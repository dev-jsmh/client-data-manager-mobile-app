import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { Client } from 'src/app/models/client';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { ClientDashboardPage } from '../client-dashboard/client-dashboard.page';
import { SqliteService } from 'src/app/services/sqlite.service';
import { DatabaseService } from 'src/app/services/database.service';


@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.page.html',
  styleUrls: ['./client-details.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    RouterModule,
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonBackButton,
    IonButtons
  ]
})
export class ClientDetailsPage implements OnInit {


  public id = "";
  public selectedClient!: Client;
  public loaded: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private database: DatabaseService
  ) {
    this.id = this.route.snapshot.params['id'];
    // load the client inside contructor
    this.loadClient();
  }

  ngOnInit() {
  }

  // load desired client 
  async loadClient() {

    let objclient = new Client();
    await this.database.getById(this.id).then((rs: any) => {

      objclient.name = rs.name;
      objclient.lastName = rs.last_name;
      objclient.neighborhood = rs.neighborhood;
      objclient.phone = rs.phone;
      objclient.address = rs.address;
      console.log("The requested client data is: ");

      for (var index = 0; Object.keys(objclient).length > index; index++) {
        const attribute = Object.values(objclient)[index];
        console.log(attribute);
      }

      this.selectedClient = objclient;
      // change the state to loaded
      this.loaded = true;

    }).catch(error => {
      Promise.reject(error)
    });

  };
  // method to delete client from data base
  public async deleteClient() {
    await this.database.delete(this.id).then(() => {
      this.router.navigate(["home"]);
    }

    ).catch( error =>  {
      console.warn("Something bad happends when trying to delete user id:" + this.id + " please check the database.service file or the typescript of client-details-page.");
    })


  };

  goToUpdateView() {
    this.router.navigate(["home", this.id, "modify-client"]);
  }

}
