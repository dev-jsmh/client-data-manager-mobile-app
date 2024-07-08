import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import { Client } from 'src/app/models/client';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonList,

} from '@ionic/angular/standalone';
import { Router, RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.page.html',
  styleUrls: ['./client-dashboard.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    ClientDashboardPage,
    RouterLink,
    RouterModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonItem,
    IonButton,
    IonIcon,
    IonSearchbar,
    IonList,

  ]
})

export class ClientDashboardPage implements OnInit {
  // array of clients 
  public clientArray: any[] = [];
  public dbReady: boolean = false;
  public loaded: boolean = false;
  // --------- inject dependencies inside constructor ---------
  constructor(
    private router: Router,
    // private sqliteService: SqliteService,
    private database: DatabaseService
  ) {
    // load clients from data base
    // change the status of data base
    this.dbReady = this.database.dbReady;
    //this.read();
  }

  ngOnInit(): void { };

  // ------ execute each time than the component is rendered on the screen
  ionViewWillEnter() {
    // wait 3 seonds while the data base is created and open
    setTimeout(() => {
      // load clients from data base
      this.read();
      // set new state to variable
      this.loaded = true;

    }, 4000);
  }

  viewDetails(id: number) {

    this.router.navigate(["home", id, "client-details"]);
  }


  async read() {
    // load the clients from service 
    // set the fecth client array to the local variable
    try {
      this.clientArray = await this.database.loadClients();
      // log message in the console
      console.log("the list of clients are: ...");

      this.clientArray.forEach((row) => {
        console.log("----- client -----");
        console.log(row.id);
        console.log(row.name);
        console.log(row.last_name);
        console.log(row.address);
        console.log(row.neighborhood);
        console.log(row.phone);
      });

    } catch (error) {
      await Promise.reject(error);

    }
  };
}
