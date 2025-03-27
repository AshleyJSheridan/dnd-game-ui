import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';

@Component({
  selector: 'app-characters-nav',
  imports: [RouterLink],
  templateUrl: './characters-nav.component.html'
})
export class CharactersNavComponent {
    constructor(private authService: AuthService, private storageService: LocalStorageService, private router: Router) {}

    logoutHandler(): void {
        this.authService.logout().subscribe({
            next: (tokenResponse) => {
                this.storageService.removeItem('token');

                this.router.navigate(['/']);
            },
            error: (tokenResponse) => {
                this.storageService.removeItem('token');

                this.router.navigate(['/']);
            }
        });
    }
}
