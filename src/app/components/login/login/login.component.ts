import { Component } from '@angular/core';
import { LogoFullComponent } from '../../logo-full/logo-full.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    imports: [
        LogoFullComponent,
        FormsModule
    ],
    templateUrl: './login.component.html'
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    error: string = '';

    constructor(private authService: AuthService, private storageService: LocalStorageService, private router: Router) {}

    submitHandler() {
        this.error = '';

        if(this.email === '' || this.password === '') {
            this.error = 'Please enter your login credentials.';

            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (tokenResponse) => {
                this.storageService.setItem('token', tokenResponse.token);

                this.router.navigate(['/characters']);
            },
            error: (error) => {
                switch (error.status) {
                    case 401:
                        this.error = 'Email or password was incorrect.';
                        break;
                    default:
                        this.error = 'There was an unexpected error. Please try again later.';
                }
            }
        });
    }
}
