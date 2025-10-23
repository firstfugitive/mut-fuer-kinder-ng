import { Routes } from '@angular/router';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';

export const routes: Routes = [
    {
        path: '**',
        component: DynamicPage,
    },
];
