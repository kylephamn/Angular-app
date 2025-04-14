import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ReactiveFormsModule],
  template: `
    <header>
      <div class="logo-container">
        <img src="csulogo.png" alt="Team 14 Logo" class="logo">
        <h1>Team 14</h1>
      </div>
      <nav>
        <ul>
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}"><i class="fas fa-home"></i> Home</a></li>
          <li><a routerLink="/color-coordinate" routerLinkActive="active"><i class="fas fa-palette"></i> Color Coordinate Generator</a></li>
          <li><a routerLink="/about" routerLinkActive="active"><i class="fas fa-users"></i> About Us</a></li>
          
        </ul>
      </nav>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer>
      <p>&copy; 2025 Team 14. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    /* 
    Color Palette:
    - Primary: #1E4D2B (CSU Green) - Used for headers, buttons, accents
    - Secondary: #C8C372 (CSU Gold) - Used for highlighting, accents
    - Accent: #F26322 (CSU Orange) - Used for call-to-action buttons, highlights
    - Background Light: #F2EFDC (Light Cream) - Used for backgrounds
    - Background Medium: #93D0AC (Light Green) - Used for card backgrounds, highlights
    */


    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #F2EFDC;
    }

    /* Header */
    header {
      background-color: #1E4D2B;
      color: #F2EFDC;
      padding: 1rem 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .logo-container {
      display: flex;
      align-items: center;
    }

    .logo {
      width: 50px;
      height: 50px;
      margin-right: 1rem;
    }

    header h1 {
      color: #F2EFDC;
      margin-bottom: 0;
      font-size: 1.8rem;
    }

    nav ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    nav li {
      margin-left: 2rem;
    }

    nav a {
      color: #C8C372;
      font-weight: 600;
      padding: 0.5rem 0.8rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    nav a i {
      margin-right: 0.5rem;
    }

    nav a:hover {
      color: #F2EFDC;
      background-color: #486b55;
    }

    nav a.active {
      color: #F2EFDC;
      background-color: #486b55;
    }

    main {
      min-height: calc(100vh - 180px);
      background-color: #F2EFDC;
    }

    footer {
      background-color: #1E4D2B;
      color: #F2EFDC;
      padding: 2rem;
      text-align: center;
      margin-top: 2rem;
    }

    @media (max-width: 768px) {
      header {
        flex-direction: column;
        padding: 1rem;
      }

      .logo-container {
        margin-bottom: 1rem;
      }

      nav ul {
        flex-wrap: wrap;
        justify-content: center;
      }

      nav li {
        margin: 0.5rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Team 14 - Color Coordinate Generator';
}