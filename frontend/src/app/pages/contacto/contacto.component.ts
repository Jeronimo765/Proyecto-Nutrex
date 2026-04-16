import { Component } from '@angular/core';

import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.scss']
})
export class ContactoComponent {
  motivoSeleccionado = '';
  enviado = false;
  enviando = false;
  errorEnvio = '';

  motivos = [
    { valor: 'plan', label: 'Quiero un plan', icono: 'Plan' },
    { valor: 'receta', label: 'Dudas sobre receta', icono: 'Receta' },
    { valor: 'soporte', label: 'Soporte tecnico', icono: 'Soporte' },
    { valor: 'nutricionista', label: 'Hablar con nutricionista', icono: 'Nutri' }
  ];

  faqs = [
    {
      pregunta: 'Como puedo crear mi plan nutricional?',
      respuesta: 'Ve a la seccion de planes, responde unas preguntas rapidas sobre tus objetivos y NutriBot te ayudara a construir una guia inicial.',
      open: false
    },
    {
      pregunta: 'Las recetas estan adaptadas a mis restricciones alimentarias?',
      respuesta: 'Si. La idea es que puedas filtrar mejor las recetas segun tus necesidades y preferencias alimentarias.',
      open: false
    },
    {
      pregunta: 'Puedo hablar con un nutricionista real?',
      respuesta: 'Claro. Si eliges ese motivo en el formulario, el equipo puede revisar tu solicitud y responderte por contacto.',
      open: false
    },
    {
      pregunta: 'NutriBot reemplaza a un nutricionista?',
      respuesta: 'No. NutriBot te orienta con dudas frecuentes y recomendaciones generales, pero no reemplaza la evaluacion profesional.',
      open: false
    }
  ];

  form = {
    nombre: '',
    email: '',
    mensaje: ''
  };

  constructor(private contactService: ContactService) {}

  seleccionarMotivo(valor: string): void {
    this.motivoSeleccionado = valor;
  }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  enviarFormulario(): void {
    if (this.enviando || !this.motivoSeleccionado) {
      return;
    }

    this.enviando = true;
    this.errorEnvio = '';

    this.contactService.sendMessage({
      nombre: this.form.nombre,
      email: this.form.email,
      motivo: this.motivoSeleccionado,
      mensaje: this.form.mensaje
    }).subscribe({
      next: () => {
        this.enviando = false;
        this.enviado = true;
        setTimeout(() => (this.enviado = false), 4000);
        this.form = { nombre: '', email: '', mensaje: '' };
        this.motivoSeleccionado = '';
      },
      error: (error) => {
        this.enviando = false;
        this.errorEnvio = error?.error?.message || 'No pudimos enviar tu mensaje. Intenta de nuevo.';
      }
    });
  }
}
