import { Routes } from '@angular/router';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';
import { environment } from '../environments/environment';

export const routes: Routes = [
    {
        path: '**',
        component: DynamicPage,
        title: environment?.organizationName
    },
];
