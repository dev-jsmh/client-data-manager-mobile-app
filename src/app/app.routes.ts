import { Routes } from '@angular/router';
import { ClientDashboardPage } from './client/client-dashboard/client-dashboard.page';
import { IndexComponent } from './client/index/index.component';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  }, {
    // routes for the client module
    path: 'clients',
    component: IndexComponent,
    children: [
      {
        path: 'dashboard',
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
