import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '../models/skill.model';
import { API_CONFIGURATION } from '../api-configuration';

@Injectable({ providedIn: 'root' })
export class SkillService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(API_CONFIGURATION, { optional: true });

  private get baseUrl(): string {
    return `${this.config?.baseUrl ?? ''}/api/skills`;
  }

  getAll(): Observable<Skill[]> {
    return this.http.get<Skill[]>(this.baseUrl);
  }

  getById(id: number): Observable<Skill> {
    return this.http.get<Skill>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateSkillRequest): Observable<Skill> {
    return this.http.post<Skill>(this.baseUrl, request);
  }

  update(id: number, request: UpdateSkillRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, { id, ...request });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
