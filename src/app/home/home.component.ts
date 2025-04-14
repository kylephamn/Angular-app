import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <h2>Create Beautiful Color Coordinate Sheets</h2>
        <p>Generate custom color coordinate sheets for educational activities, crafts, and more!</p>
        <a routerLink="/color-coordinate" class="cta-button">Start Creating</a>
      </div>
    </section>

    <section class="features">
      <div class="feature-card">
        <i class="fas fa-paint-brush feature-icon"></i>
        <h3>Custom Colors</h3>
        <p>Choose from a wide range of colors or enter your own hex codes.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-th feature-icon"></i>
        <h3>Flexible Layouts</h3>
        <p>Create coordinate grids in various sizes to suit your needs.</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-file-download feature-icon"></i>
        <h3>Easy Export</h3>
        <p>Download your color coordinate sheets as PDF or image files.</p>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps-container">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Choose Your Colors</h3>
          <p>Select colors from our palette or enter custom hex codes.</p>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Design Your Grid</h3>
          <p>Set up the size and pattern of your coordinate grid.</p>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>Generate & Download</h3>
          <p>Preview your design and download in your preferred format.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero Section */
    .hero {
      background-color: #93D0AC;
      padding: 4rem 2rem;
      text-align: center;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero h2 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: #1E4D2B;
    }

    .hero p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }

    /* Button */
    .cta-button {
      display: inline-block;
      background-color: #F26322;
      color: white;
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
    }

    .cta-button:hover {
      background-color: #d9551a;
      transform: translateY(-2px);
      color: white;
    }

    /* Features Section */
    .features {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      padding: 4rem 2rem;
    }

    .feature-card {
      flex: 1;
      min-width: 300px;
      margin: 1rem;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .feature-card:hover {
      transform: translateY(-5px);
    }

    .feature-icon {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      color: #F26322;
    }

    /* How It Works Section */
    .how-it-works {
      padding: 4rem 2rem;
      text-align: center;
    }

    .steps-container {
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      margin-top: 2rem;
    }

    .step {
      flex: 1;
      min-width: 250px;
      margin: 1rem;
      padding: 2rem;
      position: relative;
    }

    .step-number {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 50px;
      height: 50px;
      background-color: #1E4D2B;
      color: white;
      border-radius: 50%;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1.5rem;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .feature-card, .step {
        min-width: 100%;
      }
    }
  `]
})
export class HomeComponent {
  // No additional properties or methods needed for this component
}