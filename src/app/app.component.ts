import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
})
export class AppComponent {
    title = 'dnd-game-ui';
    heartbeatPeriod: number = 1000 * 60 * 5;
    heartbeatHandle: number = 0;
    tokenKey: string = 'token';

    constructor(private authService: AuthService, private storageService: LocalStorageService) {}

    ngOnInit(): void {
        this.heartbeatHandle = window.setInterval(() => {
            this.heartbeat();
        }, this.heartbeatPeriod);
    }

    heartbeat(): void {
        this.authService.heartbeat().subscribe({
            next: (tokenResponse) => {},
            error: (error) => {
                switch (error.status) {
                    case 401:
                        // attempt to refresh token once, but cancel the heartbeat if the refresh failed
                        this.authService.refreshToken();
                        break;
                    default: {
                        // on an error, log out and cancel the heartbeat
                        this.storageService.removeItem(this.tokenKey);
                        window.clearInterval(this.heartbeatHandle);
                    }
                }

            }
        });
    }
}
