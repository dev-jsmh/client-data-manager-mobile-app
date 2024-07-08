import { Routes } from '@angular/router';
import { ClientDashboardPage } from './client/client-dashboard/client-dashboard.page';
import { IndexComponent } from './client/index/index.component';

export const routes: Routes = [
  {
    // routes for the client module
    path: 'home',
    loadComponent: () => import('./client/index/index.component').then(m => m.IndexComponent),
    children: [
      {
        path: '',
        component: ClientDashboardPage
      },
      {
        path: 'create-new-client',
        loadComponent: () => import('./client/create-new-client/create-new-client.page').then(m => m.CreateNewClientPage)
      },
      {
        path: ':id/client-details',
        loadComponent: () => import('./client/client-details/client-details.page').then(m => m.ClientDetailsPage)
      },
      {
        path: ':id/modify-client',
        loadComponent: () => import('./client/modify-client/modify-client.page').then(m => m.ModifyClientPage)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },

];
