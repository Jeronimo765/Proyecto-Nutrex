import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AuthService } from './core/services/auth.service';

interface CarouselSlide {
  image: string;
  title: string;
  description: string;
  badge: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  readonly slides: CarouselSlide[] = [
    {
      image: 'assets/carousel-figs.jpg',
      title: 'Sabores naturales que elevan tu dia',
      description: 'Ideas frescas y balanceadas para mantener una nutricion rica, visual y consciente.',
      badge: 'Snack inteligente'
    },
    {
      image: 'assets/carousel-strawberries.jpg',
      title: 'Fresas frescas llenas de color y vitalidad',
      description: 'Una opcion ligera, antioxidante y visualmente atractiva para snacks y desayunos saludables.',
      badge: 'Fruta fresca'
    },
    {
      image: 'assets/carousel-oats.png',
      title: 'Avena y energia estable desde la manana',
      description: 'Combina fibra, textura y saciedad para desayunos que si sostienen tu ritmo.',
      badge: 'Desayuno funcional'
    },
    {
      image: 'assets/carousel-peanut-butter.jpg',
      title: 'Untables con energia para un desayuno practico',
      description: 'Ideas sencillas para acompanar panes y frutas con una textura cremosa y mucha saciedad.',
      badge: 'Desayuno casero'
    },
    {
      image: 'assets/carousel-chia.jpg',
      title: 'Opciones ligeras con mucho valor nutricional',
      description: 'Preparaciones simples que se sienten premium y apoyan tus objetivos de bienestar.',
      badge: 'Postre saludable'
    }
  ];

  currentSlide = 0;
  isHomeRoute = true;
  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateLayoutForRoute(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateLayoutForRoute(event.urlAfterRedirects));

    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.clearCarousel();
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.restartCarousel();
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  previousSlide(): void {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.restartCarousel();
  }

  private startCarousel(): void {
    this.clearCarousel();
    this.carouselIntervalId = setInterval(() => this.nextSlide(), 4500);
  }

  private restartCarousel(): void {
    this.startCarousel();
  }

  private clearCarousel(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
      this.carouselIntervalId = null;
    }
  }

  private updateLayoutForRoute(url: string): void {
    this.isHomeRoute = url === '/' || url === '';

    if (this.isHomeRoute) {
      this.startCarousel();
      return;
    }

    this.clearCarousel();
  }

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
