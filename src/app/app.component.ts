import { Component } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from './services/auth.service';
import {LocalStorageService} from './services/local-storage.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: '/src/styles.scss'
})
export class AppComponent {
    title = 'dnd-game-ui';
    heartbeatPeriod: number = 1000 * 60 * 5;
    heartbeatHandle: number = 0;
    tokenKey: string = 'token';

    constructor(private authService: AuthService, private storageService: LocalStorageService, private router: Router) {}

    ngOnInit(): void {
        this.heartbeatHandle = window.setInterval(() => {
            this.heartbeat();
        }, this.heartbeatPeriod);
    }

    heartbeat(): void {
        this.authService.heartbeat().subscribe({
            next: (tokenResponse) => {

            },
            error: (error) => {
                // on an error, log out and cancel the heartbeat
                this.storageService.removeItem(this.tokenKey);
                window.clearInterval(this.heartbeatHandle);
            }
        });
    }
}
