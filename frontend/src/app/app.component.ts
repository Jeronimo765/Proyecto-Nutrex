import { Component, OnDestroy, OnInit } from '@angular/core';

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
  readonly navItems = ['Inicio', 'Planes', 'Recetas', 'NutriBot', 'Contacto'];

  readonly slides: CarouselSlide[] = [
    {
      image: 'assets/carousel-figs.jpg',
      title: 'Sabores naturales que elevan tu dia',
      description: 'Ideas frescas y balanceadas para mantener una nutricion rica, visual y consciente.',
      badge: 'Snack inteligente'
    },
    {
      image: 'assets/carousel-oats.png',
      title: 'Avena y energia estable desde la manana',
      description: 'Combina fibra, textura y saciedad para desayunos que si sostienen tu ritmo.',
      badge: 'Desayuno funcional'
    },
    {
      image: 'assets/carousel-chia.jpg',
      title: 'Opciones ligeras con mucho valor nutricional',
      description: 'Preparaciones simples que se sienten premium y apoyan tus objetivos de bienestar.',
      badge: 'Postre saludable'
    }
  ];

  currentSlide = 0;
  private carouselIntervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
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
}
