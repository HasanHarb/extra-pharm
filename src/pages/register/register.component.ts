import { Component, OnInit } from '@angular/core';
import { Globals } from '../../services/globals.service';
import { Repo } from '../../services/repo.service';
import { fail } from 'assert';
import { FacebookService, LoginResponse } from 'ngx-facebook';
import { InitParams } from 'ngx-facebook/dist/esm/models/init-params';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

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
  contactForm: FormGroup;
  flag = true;
  errorArray: string[] = [];

  constructor(private globals: Globals,
    private router: Router,
    private fb: FacebookService,
    private formBuilder: FormBuilder,
    private repo: Repo) {
      this.host = window.location.host;
      this.getData();
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
			first_name: ['', [Validators.required, Validators.minLength(3)]],
			family_name: ['', [Validators.required, Validators.minLength(3)]],
			mobile: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/), Validators.minLength(9)]],
			email: ['', [Validators.required, Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i), Validators.minLength(3)]],
			city_id: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      password2: ['', [Validators.required, Validators.minLength(5)]]      
		});
  }

  register() {
    console.log('enter');   
		this.flag = true;
		this.errorArray = [];
		if (this.contactForm.controls['first_name'].invalid) {
			this.errorArray.push('FIRSTNAME_REQUIRED');
			this.flag = false;
    }
    if (this.contactForm.controls['family_name'].invalid) {
			this.errorArray.push('FAMILYNAME_REQUIRED');
			this.flag = false;
    }
    if (this.contactForm.controls['mobile'].invalid) {
			this.errorArray.push('CONTACT_PHONE_NUMBER_REQUIRED');
			this.flag = false;
    }
    if (this.contactForm.controls['email'].invalid) {
			this.errorArray.push('EMAIL_NOT_VALID');
			this.flag = false;
    }
    if (this.contactForm.controls['city_id'].invalid) {
			this.errorArray.push('CITYTOWN_REQUIRED');
			this.flag = false;
    }
    if (this.contactForm.controls['address'].invalid) {
			this.errorArray.push('ADDRESS_REQUIRED');
			this.flag = false;
    }
    if (this.contactForm.controls['password'].invalid) {
			this.errorArray.push('PASSWORD_REQUIRED');
			this.flag = false;
    }
    if (!this.contactForm.controls['password'].invalid) {
      console.log('check pass');
      if (!this.validatePassword(this.contactForm.controls['password'].value)) {
        console.log("PASSWORD_NOT_VALID");
        this.errorArray.push("PASSWORD_NOT_VALID");
        this.flag = false;
      }
      console.log(this.flag);
    }
    if (this.contactForm.controls['password'].value != this.contactForm.controls['password2'].value) {
			this.errorArray.push('PASSWORD_NOT_MATCH');
			this.flag = false;
    }
		console.log(this.contactForm.value);
		if(this.flag)
		{
      this.repo.getEmail(this.contactForm.controls['email'].value).subscribe((data: any) => {
        this.email = data.email;
        console.log('check email -------');
        console.log(data);
        console.log(this.email);
        if(this.email){
          this.errorArray.push("USED_EMAIL");
          this.flag = false;
          console.log(this.flag);
        }
        else {
          this.repo.register(this.contactForm.value)
            .subscribe(data => {
              this.flag = false;
              if (data == null){
                this.errorArray.push("REG_ERROR");
              }
              else {
                this.item = data;
                localStorage.EFUserData = JSON.stringify(data);
                localStorage.api_token = this.item.api_token;
                this.router.navigate(['']);
              }
            }, err => {
              if(err._body === '{"email":["The email has already been taken."]}')
              this.errorArray.push("USED_EMAIL");
              else
              this.errorArray.push("REG_ERROR");
              this.flag = false;
              console.log(err._body);
            }, () => this.flag = false
            );
        }
      }, err => {
        this.errorArray.push("USED_EMAIL");
        this.flag = false;
      });
		}
		
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

    console.log('Enter');this.fb.login()
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
}
