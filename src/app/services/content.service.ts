import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { runtimeContent } from '../data/_runtime';

const SLOTS = [
  'settings',
  'navigation',
  'home',
  'military',
  'work',
  'projects',
  'development',
  'education',
] as const;

type Slot = (typeof SLOTS)[number];

@Injectable({ providedIn: 'root' })
export class ContentService {
  private http = inject(HttpClient);

  async loadAll(): Promise<void> {
    if (typeof window === 'undefined') return; // skip during SSR
    await Promise.all(SLOTS.map((slot) => this.loadOne(slot)));
  }

  private async loadOne(slot: Slot): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get<unknown>(`/content/${slot}.json`),
      );
      (runtimeContent as Record<string, unknown>)[slot] = data;
    } catch (err) {
      console.warn(`[content] failed to load ${slot}.json, using fallback`, err);
    }
  }
}
