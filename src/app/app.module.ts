import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { CommonModule } from '@angular/common';
import { ShareButtonsModule } from 'ngx-sharebuttons';
// import { RangeSliderModule } from 'ngx-rangeslider-component';

// pages
import { HomepageComponent } from '../pages/homepage/homepage.component';
import { SalesComponent } from '../pages/sales/sales.component';
import { ContactComponent } from '../pages/contact/contact.component';
import { FaqComponent } from '../pages/faq/faq.component';
import { MyAccountComponent } from '../pages/my-account/my-account.component';
import { RegisterComponent } from '../pages/register/register.component';
import { LoginComponent } from '../pages/login/login.component';
import { CartComponent } from '../pages/cart/cart.component';
import { ProductsComponent } from '../pages/products/products.component';
import { ProductComponent } from '../pages/product/product.component';
import { CategoriesComponent } from '../pages/categories/categories.component';
import { WishlistComponent } from "../pages/favorites/wishlist.component";
import { ThanksComponent } from "../pages/thanks/thanks.component";
import { HttpModule, Http } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TopTenComponent } from '../pages/top-ten/top-ten.component';
import { SearchResultsComponent } from '../pages/search-results/search-results.component';
import { SubscribingThanksComponent } from '../pages/subscribing-thanks/subscribing-thanks.component';
import { PageNotFoundComponent }   from '../pages/not-found/not-found.component';
import { TermsComponent } from '../pages/terms/terms.component';

// components
import { ProductItemComponent } from '../components/product-item/product.component';
import { FilterByComponent } from '../components/filter-by/filter-by.component';
import { SliderComponent } from '../components/slider/slider.component';
import { PromotionBoxesComponent } from '../components/promotion-boxes/promotion-boxes.component';
import { MyAccountSideBarComponent } from '../components/my-account-sidebar/my-account-sidebar.component';

// services
import { Repo } from '../services/repo.service';
import { Cart } from '../services/cart.service';
import { Favorites } from '../services/favorites.service';
import { Globals } from '../services/globals.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { CustomFormsModule } from 'ng2-validation';


// pipes
import { LocalizePipe } from '../pipes/localize';
import { SearchPipe } from '../pipes/search';

// plugins
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { OwlModule } from 'ngx-owl-carousel';
import { FacebookModule } from 'ngx-facebook';
import { BusyModule } from 'angular2-busy';
import { SpinnerModule } from 'angular2-spinner/dist';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';

import { ResetPasswordComponent } from '../pages/reset-password/reset-password.component';
import { EditProfileComponent } from '../pages/edit-profile/edit-profile.component';
import { ChangePasswordComponent } from '../pages/change-password/change-password.component';
import { MyOrdersComponent } from '../pages/my-orders/my-orders.component';
import { MyFavouritesComponent } from '../pages/my-fav/my-fav.component';
import { OrderComponent } from '../pages/order/order.component';
import { PageComponent } from '../pages/page/page.component';

import { NgxImageZoomModule } from 'ngx-image-zoom';

export function createTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
	declarations: [
		AppComponent,
		HomepageComponent,
		SliderComponent,
		SalesComponent,
		ContactComponent,
		ProductItemComponent,
		FilterByComponent,
		FaqComponent,
		MyAccountSideBarComponent,
		MyAccountComponent,
		RegisterComponent,
		LoginComponent,
		CartComponent,
		ProductsComponent,
		ProductComponent,
		CategoriesComponent,
		WishlistComponent,
		LocalizePipe,
		SearchPipe,
		ResetPasswordComponent,
		PromotionBoxesComponent,
		TopTenComponent,
		ThanksComponent,
		SearchResultsComponent,
		EditProfileComponent,
		ChangePasswordComponent,
		MyOrdersComponent,
		OrderComponent,
		MyFavouritesComponent,
		PageComponent,
		SubscribingThanksComponent,
		PageNotFoundComponent,
		TermsComponent
	],
	imports: [
    NgxImageZoomModule.forRoot(),
		ConfirmationPopoverModule.forRoot({
			confirmButtonType: 'danger' // set defaults here
		  }),
		SpinnerModule,
		BusyModule,
		FacebookModule.forRoot(),
		ShareButtonsModule.forRoot(),
		// RangeSliderModule,
		OwlModule,
		HttpModule,
		BrowserModule,
		FormsModule,
		CustomFormsModule,
		BusyModule,
		ReactiveFormsModule,
		HttpClientModule,
		CommonModule,
		BrowserAnimationsModule, // required animations module
		ToastrModule.forRoot(), // ToastrModule added
		AppRoutingModule,
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: (createTranslateLoader),
				deps: [HttpClient]
			}
		})
	],
	providers: [
		Globals,
		Repo,
		Cart,
		Favorites,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
