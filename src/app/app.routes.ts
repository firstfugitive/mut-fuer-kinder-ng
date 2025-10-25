import { Routes } from '@angular/router';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';
import { environment } from '../environments/environment';
import { generatePaths } from './components/shared/generatePaths';

export const routes: Routes = [
    {
        path: environment.production ? '' : '**',
        component: DynamicPage,
        title: environment?.organizationName,
        loadChildren: environment.production ? generatePaths : undefined
    }
];
