import { Component, OnInit } from '@angular/core';
import { Globals } from '../../services/globals.service';
import { Repo } from '../../services/repo.service';
import { fail } from 'assert';
import { FacebookService, LoginResponse } from 'ngx-facebook';
import { InitParams } from 'ngx-facebook/dist/esm/models/init-params';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  item: any = {};
  isLoading: boolean = false;
  host = "";
  email: any;
  cities: any;

  constructor(private globals: Globals,
    private router: Router,
    private fb: FacebookService,
    private repo: Repo) {
      this.host = window.location.host;
      this.getData();
  }

  ngOnInit() {
  }

  getData() {
    this.repo.getCities().subscribe(data => {
      this.cities = data;
    });
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

    /*let initParams: InitParams = {
      appId: '231283564071449',
      xfbml: true,
      version: 'v2.8'
    };

    this.fb.init(initParams);

    console.log(this.fb.init(initParams));
      /*.then((response: any) => console.log(response))
      .catch((error: any) => console.error(error));
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

  validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  validatePassword(password) {

    var allLetters = /^[a-zA-Z]+$/;
    var letter = /[a-zA-Z]/;
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;
    var number = /[0-9]/;

    var password = password;

    var invalid = [];

    if (password.length < 8 ) {
        invalid.push("*length");
    }
    if (!upperCaseLetters.test(password)) {
        invalid.push("*upperCaseLetters");
    }
    if (!lowerCaseLetters.test(password)) {
        invalid.push("*lowerCaseLetters");
    }
    if (!numbers.test(password)) {
        invalid.push("*numbers");
    }

    if (invalid.length != 0) {
        // alert("Please provide response: \n" + invalid.join("\n"));
        return false;
    }

    return true;
}

  doRegister() {
    this.isLoading = true;
    if (this.item.email) {
      if(this.validateEmail(this.item.email)) {
        let paramsEmail = {
          email: this.item.email
        };
        this.repo.getEmail(paramsEmail).subscribe((data: any) => {
          this.email = data.email;
          if(this.email){
            alert(this.globals.translatefn("USED_EMAIL"));
            this.isLoading = false;
          }
          else if (!this.item.first_name) {
            alert(this.globals.translatefn("FIRSTNAME_REQUIRED"));
            this.isLoading = false;
          }
          else if (!this.item.family_name) {
            alert(this.globals.translatefn("FAMILYNAME_REQUIRED"));
            this.isLoading = false;
          }
          else if (!this.item.mobile) {
            alert(this.globals.translatefn("MOBILE_REQUIRED"));
            this.isLoading = false;
          }
          else if (!this.item.city_id) {
            alert(this.globals.translatefn("CITYTOWN_REQUIRED"));
            this.isLoading = false;
          }
          else if (!this.item.address) {
            alert(this.globals.translatefn("ADDRESS_REQUIRED"));
            this.isLoading = false;
          }
          else if (!this.item.password) {
            alert(this.globals.translatefn("PASSWORD_REQUIRED"));
            this.isLoading = false;
          } else if (!this.validatePassword(this.item.password)) {
            alert(this.globals.translatefn("PASSWORD_NOT_VALID"));
            this.isLoading = false;
          }
          else if (this.item.password != this.item.password2) {
            alert(this.globals.translatefn("PASSWORD_NOT_MATCH"));
            this.isLoading = false;
          }
          else {
            this.repo.register(this.item)
              .subscribe(data => {
                this.isLoading = false;
                if (data == null){
                  alert(this.globals.translatefn("REG_ERROR"));
                }
                else {
                  this.item = data;
                  localStorage.EFUserData = JSON.stringify(data);
                  localStorage.api_token = this.item.api_token;
                  this.router.navigate(['']);
                }
              }, err => {
                this.isLoading = false;
                alert(err._body);
              }, () => this.isLoading = false
              );
          }
        }, err => {
          alert(this.globals.translatefn("USED_EMAIL"));
          this.isLoading = false;
        });
      }
      else {
        alert(this.globals.translatefn("EMAIL_NOT_VALID"));
            this.isLoading = false;
      }
    }
    else {
      alert(this.globals.translatefn("EMAIL_REQUIRED"));
          this.isLoading = false;
    }
  }
}
