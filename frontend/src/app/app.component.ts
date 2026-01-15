import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      
      <main class="main-content">
        <div class="container mt-4">
          <router-outlet></router-outlet>
        </div>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'order-tracking-frontend';
}