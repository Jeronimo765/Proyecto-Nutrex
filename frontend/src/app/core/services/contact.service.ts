import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

export interface ContactRequest {
  nombre: string;
  email: string;
  motivo: string;
  mensaje: string;
}

export interface ContactResponse {
  id: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly baseUrl = environment.contactApiUrl;

  constructor(private http: HttpClient) {}

  sendMessage(payload: ContactRequest): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(this.baseUrl, payload);
  }
}
