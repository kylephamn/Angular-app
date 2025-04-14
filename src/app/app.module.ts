import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      margin: 0 auto;
      max-width: 1200px;
    }
  `]
})
export class AppComponent {
  title = 'Color Coordinate Generator';
}