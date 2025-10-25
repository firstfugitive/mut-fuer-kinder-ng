import { Routes } from '@angular/router';
import { DynamicPage } from './pages/dynamic-page/dynamic-page';
import { environment } from '../environments/environment';
import { generatePaths } from './components/shared/generatePaths';

export const routes: Routes = [
    {
        path: '',
        loadChildren: generatePaths
    },
    // {
    //     path: '*',
    //     redirectTo: 'home'
    // }
];
