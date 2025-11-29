import { Routes } from '@angular/router';
import { generatePaths } from './components/shared/generatePaths';

export const routes: Routes = [
    {
        path: '',
        loadChildren: generatePaths
    },
    {
        path: '*',
        redirectTo: ''
    }
];
