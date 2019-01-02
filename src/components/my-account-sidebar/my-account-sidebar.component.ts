import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'my-account-sidebar',
  templateUrl: './my-account-sidebar.component.html',
  styleUrls: ['./my-account-sidebar.component.css']
})
export class MyAccountSideBarComponent implements OnInit {

  @Input() source: string = "";
  links = [
    { routerLink: "/profile", title: "PERSONAL_PROFILE", selector: "info" },
    { routerLink: "/edit-profile", title: "EDIT_PROFILE", selector: "edit-profile" },
    { routerLink: "/change-password", title: "CHANGE_PASSWROD", selector: "change-password" },
    { routerLink: "/my-orders", title: "MY_ORDERS", selector: "orders" },
    { routerLink: "/my-favourites", title: "MY_FAVOURITES", selector: "fav" },
  ];

  host = "";

  constructor() { 
    this.host = window.location.host;
  }

  ngOnInit() {
    
  }

}