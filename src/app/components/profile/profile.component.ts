import {Component, ElementRef, ViewChild} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { UserService } from '../../services/user.service';
import { User } from '../../entities/User';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ConfirmComponent} from '../dialogs/confirm/confirm.component';

@Component({
    selector: 'app-profile-component',
    imports: [RouterLink, RouterLinkActive, HeaderComponent, DatePipe, FormsModule, ConfirmComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent {
    public user: User | null = null;
    public editProfile: boolean = false;

    @ViewChild ('profileForm') profileForm: any;
    @ViewChild('newPassword') newPassword!: ElementRef<HTMLInputElement>;
    @ViewChild('passwordConfirm') passwordConfirm!: ElementRef<HTMLInputElement>;
    @ViewChild('profileDeleteConfirm') profileDeleteConfirm: ConfirmComponent | undefined;

    constructor(
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userService.getUser().subscribe({
            next: (user) => {
                this.user = user;
            },
            error: (error) => {
                this.router.navigate(['/']);
            }
        });
    }

    saveProfile(form: HTMLFormElement): void {
        this.validatePasswords(
            this.newPassword.nativeElement,
            this.passwordConfirm.nativeElement
        );

        if (!form.checkValidity())
        {
            form.reportValidity();
            return;
        }

        this.userService.updateUser(this.user!, this.newPassword.nativeElement.value, this.passwordConfirm.nativeElement.value
        ).subscribe({
            next: (user) => {
                this.user = user;
                this.editProfile = false;
            },
            error: (error) => {
                // handle error here with a toast notification.
            }
        });
    }

    setEditProfile(): void {
        this.editProfile = true;
    }

    setCancelEdit(): void {
        this.editProfile = false;
    }

    public validatePasswords(password: HTMLInputElement, passwordConfirm: HTMLInputElement): void {
        // Clear any existing validation error.
        passwordConfirm.setCustomValidity('');

        // Password is optional.
        if (!password.value) {
            return;
        }

        if (password.value !== passwordConfirm.value) {
            passwordConfirm.setCustomValidity(
                'The password confirmation does not match.'
            );
        }
    }

    public deleteProfile(event: MouseEvent): void {
        if(event.currentTarget !== null) {
            this.profileDeleteConfirm?.showModal(event.currentTarget);
        }
    }

    public confirmDeleteProfile(): void {
        // make call to delete the user.
        this.userService.deleteUser().subscribe({
            next: () => {
                this.router.navigate(['/']);
            },
            error: (error) => {
                // handle error here with a toast notification.
            }
        });
    }
}
