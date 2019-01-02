import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from "../pages/homepage/homepage.component";
import { SalesComponent } from "../pages/sales/sales.component";
import { ContactComponent } from "../pages/contact/contact.component";
import { FaqComponent } from "../pages/faq/faq.component";
import { MyAccountComponent } from "../pages/my-account/my-account.component";
import { WishlistComponent } from "../pages/favorites/wishlist.component";
import { RegisterComponent } from "../pages/register/register.component";
import { LoginComponent } from "../pages/login/login.component";
import { CartComponent } from "../pages/cart/cart.component";
import { ProductsComponent } from '../pages/products/products.component';
import { ProductComponent } from '../pages/product/product.component';
import { CategoriesComponent } from '../pages/categories/categories.component';
import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { TopTenComponent } from "../pages/top-ten/top-ten.component";
import { ThanksComponent } from '../pages/thanks/thanks.component';
import { CanActivate } from '@angular/router/src/interfaces';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router/src/router_state';
import { Observable } from 'rxjs/Observable';
import { Repo } from '../services/repo.service';
import { Router } from '@angular/router';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { EditProfileComponent } from '../pages/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { MyOrdersComponent } from '../pages/my-orders/my-orders.component';
import { MyFavouritesComponent } from '../pages/my-fav/my-fav.component';
import { OrderComponent } from '../pages/order/order.component';
import { PageComponent } from '../pages/page/page.component';
import { SubscribingThanksComponent } from '../pages/subscribing-thanks/subscribing-thanks.component';
import { PageNotFoundComponent }   from '../pages/not-found/not-found.component';

@Injectable()
export class LoggedInUser implements CanActivate {
  constructor(private repo: Repo, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
	  let result = this.repo.isLoggedIn();
	  if(!result)
	  {
			this.router.navigate(['/login']);
	  }
	  return result;
  }
}

@Injectable()
export class LoggedOutUser implements CanActivate {
  constructor(private repo: Repo, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
	  let result = !this.repo.isLoggedIn();
	  if(!result)
	  {
		this.router.navigate(['/homepage']);
	  }
	  return result;
  }
}

export const appRoutes: Routes = [
	{ path: '', component: HomepageComponent },
	{ path: 'products', component: CategoriesComponent },
	{ path: 'products/:slug', component: ProductsComponent },
	{ path: 'product/:id', component: ProductComponent },
	{ path: 'sales', component: SalesComponent },
	{ path: 'contact-us', component: ContactComponent },
	{ path: 'faq', component: FaqComponent },
	{ path: 'profile', component: MyAccountComponent, canActivate: [LoggedInUser] },
	{ path: 'edit-profile', component: EditProfileComponent, canActivate: [LoggedInUser] },
	{ path: 'change-password', component: ChangePasswordComponent, canActivate: [LoggedInUser] },
	{ path: 'my-orders', component: MyOrdersComponent, canActivate: [LoggedInUser] },
	{ path: 'my-orders/:id', component: OrderComponent, canActivate: [LoggedInUser] },
	{ path: 'my-favourites', component: MyFavouritesComponent, canActivate: [LoggedInUser] },
	{ path: 'favorites', component: WishlistComponent },
	{ path: 'register', component: RegisterComponent, canActivate: [LoggedOutUser] },
	{ path: 'register/:component', component: RegisterComponent, canActivate: [LoggedOutUser] },
	{ path: 'login', component: LoginComponent, canActivate: [LoggedOutUser] },
	{ path: 'login/:component', component: LoginComponent, canActivate: [LoggedOutUser] },
	{ path: 'reset-password', component: ResetPasswordComponent, canActivate: [LoggedOutUser] },
	{ path: 'cart', component: CartComponent },	
	{ path: 'top-ten', component: TopTenComponent },
	{ path: 'search', component: SearchResultsComponent },
	{ path: 'thanks', component: ThanksComponent },
	{ path: 'subscribing-thanks', component: SubscribingThanksComponent },
	{	path: '404', component: PageNotFoundComponent },
	{ path: ':slug', component: PageComponent },
	{ path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forRoot(appRoutes),

	],
	exports: [RouterModule],
	providers: [LoggedInUser, LoggedOutUser],

	declarations: []
})
export class AppRoutingModule { }
