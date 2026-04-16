import { Component, ElementRef, ViewChild } from '@angular/core';
import { NutritionService } from '../../../core/services/nutrition.service';

export interface FoodAnalysis {
  food_name:      string;
  calories:       number;
  carbs_g:        number;
  protein_g:      number;
  fats_g:         number;
  fiber_g:        number;
  sodium_mg:      number;
  glycemic_index: number | null;
  is_suitable:    boolean;
  recommendation: string;
  warnings:       string[];
}

@Component({
  selector:    'app-food-analyzer',
  templateUrl: './food-analyzer.component.html',
  styleUrls:   ['./food-analyzer.component.scss']
})
export class FoodAnalyzerComponent {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Estados de la pantalla
  state: 'idle' | 'preview' | 'analyzing' | 'result' | 'error' = 'idle';

  // Datos
  selectedFile:  File | null     = null;
  previewUrl:    string | null   = null;
  analysis:      FoodAnalysis | null = null;
  textQuery      = '';
  activeTab:     'photo' | 'text' = 'photo';
  errorMsg       = '';
  conditions     = ['DIABETES_T2'];

  // Drag & Drop
  isDragging = false;

  constructor(private nutritionService: NutritionService) {}

  // ── Drag & Drop ──────────────────────────────
  onDragOver(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  onDrop(e: DragEvent): void {
    e.preventDefault();
    this.isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith('image/')) {
      this.loadFile(file);
    }
  }

  // ── Selección de archivo ─────────────────────
  onFileSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file) this.loadFile(file);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  private loadFile(file: File): void {
    this.selectedFile = file;
    this.state        = 'preview';

    // Genera preview de la imagen
    const reader      = new FileReader();
    reader.onload     = (e) => {
      this.previewUrl = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ── Análisis por foto ────────────────────────
  analyzePhoto(): void {
    if (!this.selectedFile) return;

    this.state    = 'analyzing';
    this.errorMsg = '';

    this.nutritionService
      .analyzePhoto(this.selectedFile)
      .subscribe({
        next:  (res) => { this.analysis = res; this.state = 'result'; },
        error: ()    => {
          this.errorMsg = 'No pude analizar la imagen. Intenta con otra foto.';
          this.state    = 'error';
        }
      });
  }

  // ── Análisis por texto ───────────────────────
  analyzeText(): void {
    if (!this.textQuery.trim()) return;

    this.state    = 'analyzing';
    this.errorMsg = '';

    this.nutritionService
      .analyzeFoodText(this.textQuery, this.conditions)
      .subscribe({
        next:  (res) => { this.analysis = res; this.state = 'result'; },
        error: ()    => {
          this.errorMsg = 'Error al analizar el alimento.';
          this.state    = 'error';
        }
      });
  }

  // ── Helpers ──────────────────────────────────
  reset(): void {
    this.state        = 'idle';
    this.selectedFile = null;
    this.previewUrl   = null;
    this.analysis     = null;
    this.textQuery    = '';
    this.errorMsg     = '';
  }

  getProgressWidth(value: number, max: number): number {
    return Math.min(Math.round((value / max) * 100), 100);
  }

  getSuitabilityClass(): string {
    return this.analysis?.is_suitable ? 'badge--green' : 'badge--danger';
  }

  getSuitabilityText(): string {
    return this.analysis?.is_suitable
      ? ' Apto para tu condición'
      : ' Con precaución';
  }
}