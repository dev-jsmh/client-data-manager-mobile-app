import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  standalone: true,
  styleUrls: ['./index.component.scss'],
  imports: [
    IonRouterOutlet,
    RouterModule,
    IonRouterOutlet
  ]
})
export class IndexComponent {

  constructor() { }


}
