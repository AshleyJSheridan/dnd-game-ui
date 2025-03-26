import { Component } from '@angular/core';
import { LogoFullComponent } from '../../logo-full/logo-full.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LocalStorageService } from '../../../services/local-storage.service';

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

    constructor(private authService: AuthService, private storageService: LocalStorageService) {}

    submitHandler() {
        this.error = '';

        if(this.email === '' || this.password === '') {
            this.error = 'Please enter your login credentials.';

            return;
        }

        this.authService.login(this.email, this.password).subscribe(
            (tokenResponse) => {
                this.storageService.setItem('token', tokenResponse.token);
            },
            (error) => {
                switch (error.status) {
                    case 401:
                        this.error = 'Email or password was incorrect.';
                        break;
                    default:
                        this.error = 'There was an unexpected error. Please try again later.';
                }
            }
        );
    }
}
