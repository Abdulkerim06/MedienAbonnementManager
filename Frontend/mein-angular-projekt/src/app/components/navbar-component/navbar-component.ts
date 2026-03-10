import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth/auth-service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar-component.html',
  styleUrls: ['./navbar-component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected async openProviders(): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      await this.authService.login('/providers');
      return;
    }

    await this.router.navigate(['/providers']);
  }
}
