import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from "@ionic/angular";
import { DatabaseService } from './services/database.service';
// ---- splash screen ------
import { SplashScreen } from '@capacitor/splash-screen';


import { defineCustomElements as jeepSqlite } from "jeep-sqlite/loader";
import { Device } from '@capacitor/device';
import { SqliteService } from './services/sqlite.service';
import { NgIf } from '@angular/common';

jeepSqlite(window);

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    NgIf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent {

  public isWeb: boolean = false;
  public load: boolean = false;
  public isAndroid: boolean = false;

  constructor(
    private platform: Platform,
    private sqliteService: SqliteService,
    private database: DatabaseService) {
    this.initApp();
  }

  async initApp() {


    /**
     *   // check the platform 
    this.platform.ready().then(

      async () => {

        const info = await Device.getInfo();
        this.isWeb = info.platform == "web";

        this.sqliteService.init();
        this.sqliteService.dbReady.subscribe(load => {
          this.load = load;
        });


      });
     * 
     */

    await this.database.initializePlugins();
    SplashScreen.hide();

    const info = await Device.getInfo()
    if (info.platform == 'android') {
      this.isAndroid = true;
    }

  }
}
