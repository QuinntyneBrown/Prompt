import { InjectionToken, Provider } from '@angular/core';

export interface ApiConfiguration {
  baseUrl: string;
}

export const API_CONFIGURATION = new InjectionToken<ApiConfiguration>('API_CONFIGURATION');

export function provideApi(config: ApiConfiguration): Provider {
  return { provide: API_CONFIGURATION, useValue: config };
}
