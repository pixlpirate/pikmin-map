import { Routes } from '@angular/router';

import { PageAboutComponent, PageMapComponent, PageNotFoundComponent } from './components';

export const routes: Routes = [
	{
		path: '',
		component: PageMapComponent
	},
	{
		path: 'about',
		component: PageAboutComponent
	},
	{
		path: '**', pathMatch: 'full',
		component: PageNotFoundComponent
	}
];