import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FacebookService, LoginResponse } from 'ngx-facebook';
import { Location } from "@angular/common";
import { InitParams } from 'ngx-facebook/dist/esm/models/init-params';
import { Globals } from '../../services/globals.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string = "";
  password: string = "";
  isLoading = false;
  busy: any;
  txtError:string = "";

  host = "";

  constructor(private repo: Repo,
    private fb: FacebookService,
    private globals: Globals,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) { 
      this.host = window.location.host;
    }

  ngOnInit() {
  }

  loginWithFB() {
    let initParams: InitParams = {
      appId: '231283564071449',
      xfbml: true,
      version: 'v2.8'
    };

    this.fb.init(initParams);
    
    this.fb.login()
    .then((response: LoginResponse) => console.log(response))
    .catch((error: any) => console.error(error));

    // this.fb.init(initParams).then((response: any) => console.log(response))
    //   .catch((error: any) => console.error(error));
    /*this.facebook.login(['email', 'public_profile']).then((response: FacebookLoginResponse) => {
      this.facebook.api('me?fields=id,name,email,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        fbItem.email = profile['email'];
        fbItem.name = profile['name'];
        fbItem.avatar = profile['picture_large']['data']['url'];

        this.repo.loginFB(fbItem).subscribe(data => {
          this.isLoginBtnActivated = false;
          if (data.api_token == null) {
            loading.dismiss();
            this.presentAlert(this.translatefn('WRONG_USERNAME_OR_PASSWORD'));
          }
          else {
            if (this.platform.is('cordova')) this.oneSignal.syncHashedEmail(fbItem.email);
            fbItem = data;
            localStorage.EFUserData = JSON.stringify(data);
            localStorage.api_token = fbItem.api_token;
            this.events.publish('user:logged-in');
            //this.repo.syncLocalCartToServerCart(this.cart.getCart());
            fbItem = null;
            loading.dismiss();
            if (this.navParams.get('component')) {
              this.navCtrl.push(this.navParams.get('component'), { params: this.navParams.get('params') })
                .then(() => {
                  const index = this.navCtrl.getActive().index - 1;
                  this.navCtrl.remove(index, 0);
                });
            } else {
              this.navCtrl.setRoot(HomePage);
            }
            //this.navCtrl.push(HomePage);
          }
        }, err => {
          loading.dismiss();
          this.isLoginBtnActivated = false;
          this.presentAlert(JSON.stringify(err._body));
        }, () => this.isLoginBtnActivated = false
        );
      });
    }, (reject) => {
      loading.dismiss();
    });*/
  }

  doLogin() : void {
    this.isLoading = true;
    if (!this.email) {
      this.isLoading = false;
      this.txtError = this.globals.translatefn("EMAIL_REQUIRED");
    }
    else if (!this.password) {
      this.isLoading = false;
      this.txtError = this.globals.translatefn("PASSWORD_REQUIRED");
    }
    else {
      this.busy = this.repo.login({ email: this.email, password: this.password })
        .subscribe(data => {
          this.isLoading = false;
          if (data.api_token == null)
          this.txtError = this.globals.translatefn('WRONG_USERNAME_OR_PASSWORD');
          else {
            localStorage.EFUserData = JSON.stringify(data);
            localStorage.api_token = data.api_token;
            var source = "";

            this.route.queryParams.subscribe(params => {
              source = params['source'] || '';
              source = source.split('_').join('/');
            });
            if (source)
              {
                this.router.navigate([source]);
              }
              else
              {
                this.router.navigate(['']);
              }
          }
        }, err => {
          this.isLoading = false;
        }, () => {
          this.isLoading = false;
        }
        );
    }  
  }
}
