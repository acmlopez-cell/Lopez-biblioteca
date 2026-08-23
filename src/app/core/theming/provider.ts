import {
  EnvironmentProviders,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
  inject,
} from '@angular/core';

import { ThemeConfig } from './models/theming';
import { Theming } from './theming';

export const THEME_CONFIG = new InjectionToken<ThemeConfig>(
  'THEME_CONFIG',
);

export function provideTheming(
  config: ThemeConfig,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: THEME_CONFIG,
      useValue: config,
    },

    provideAppInitializer(() => {
      inject(Theming);
    }),
  ]);
}