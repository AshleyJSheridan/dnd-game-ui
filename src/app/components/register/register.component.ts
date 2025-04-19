import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoFullComponent } from '../logo-full/logo-full.component';
import { LocalStorageService } from '../../services/local-storage.service';

@Component({
    selector: 'app-register',
    imports: [
        FormsModule,
        LogoFullComponent,
        ReactiveFormsModule,
        RouterLink,
        RouterLinkActive
    ],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    success: boolean = false;
    error: string = '';
    name: string = '';
    email: string = '';
    password: string = '';
    password_confirmation: string = '';
    tokenKey: string = 'access_token';
    refreshTokenKey = 'refresh_token';

    constructor(private authService: AuthService) {}

    submitHandler() {
        this.error = '';
        this.success = false;

        if(this.name === '' || this.email === '' || this.password === '')
            return;

        this.authService.register(this.name, this.email, this.password, this.password_confirmation).subscribe({
            next: (response) => {
                this.success = true;
            },
            error: (error) => {
                this.error = 'There was an unexpected error, please try again. ';
            }
        });
    }
}
