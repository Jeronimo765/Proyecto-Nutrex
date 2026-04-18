import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessage {
  role:      'user' | 'assistant';
  content:   string;
  timestamp: Date;
}

export interface ChatRequest {
  message:         string;
  history:         { role: string; content: string }[];
  user_conditions: string[];
  user_name:       string;
}

export interface ChatResponse {
  response:    string;
  tokens_used: number;
}

@Injectable({ providedIn: 'root' })
export class ChatService {

  private readonly API = `${environment.gatewayUrl}/api/chat`;

  constructor(private http: HttpClient) {}

  sendMessage(request: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.API}/`, request);
  }
}
