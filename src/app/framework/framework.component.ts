import { Component, OnInit } from '@angular/core';
import { User } from '../fclass/user';
import { AuthenticationService } from '../fservice/authentication.service';

@Component({
  selector: 'app-framework',
  templateUrl: './framework.component.html',
  styleUrls: ['./framework.component.css']
})
export class FrameworkComponent implements OnInit {

 
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }
  public doLogout(): void {
    this.authenticationService.logout();
  }
  public isLoggedIn(): boolean {
    const ret=this.authenticationService.isLoggedIn();
    //console.log(ret);
    return ret;
  }
  public getUsername(): string {
    const user: User = this.authenticationService.getCurrentUser();
    // console.log(user);
    return user && user.name ? user.name : 'Guest';
  }
}