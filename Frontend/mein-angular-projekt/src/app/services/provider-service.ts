import { Injectable } from '@angular/core';
import {Provider} from '../interfaces/provider';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private providers: Provider[] = [];
  private nextId = 1;

  getProviders(): Provider[] {
    return this.providers;
  }

  addProvider(name: string, endDate: Date): void {
    this.providers.push({
      id: this.nextId++,
      name,
      endDate
    });
  }
}
