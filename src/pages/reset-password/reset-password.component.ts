import { Component, OnInit } from '@angular/core';
import { Repo } from '../../services/repo.service';
import { Router } from '@angular/router';
import { FacebookService } from 'ngx-facebook/dist/esm/providers/facebook';
import { Location } from "@angular/common";
import { InitParams } from 'ngx-facebook/dist/esm/models/init-params';
import { Globals } from '../../services/globals.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  email: string = "";
  txtLabel = "";
  host = "";

  constructor(private repo: Repo,
    private globals: Globals,
    private router: Router,
    private location: Location) {
      this.host = window.location.host;
  }

  ngOnInit() {
  }

  doReset() {

    if (!this.email) {
      this.txtLabel = "ENTER_EMAIL_RESET_PASSWORD";
    }
    else {
      this.repo.resetPassword({ email: this.email })
        .subscribe(data => {
          if (data == 'exist') {
            this.txtLabel = "PASSWORD_SENT_MSG";
          }
          else {
            this.txtLabel = "EMAIL_NOT_IN_DB";
          }
        },
        err => {
          this.txtLabel = "REG_ERROR";
        });

    }

  }
}
