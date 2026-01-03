// src/app/navbar/navbar.component.ts
import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth-service';
import {KeycloakOperationService} from '../../services/keycloak.service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  userProfile: any | null = null;


  constructor(
    private keyCloakService: KeycloakOperationService,
  ) {}

  ngOnInit():void {
    this.keyCloakService.getUserProfile().then((data:any)=>{
      this.userProfile = data;
      console.table(this.userProfile)

    })
  }

  logout(){
    this.keyCloakService.logout();
  }

}
