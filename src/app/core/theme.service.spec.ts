import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ThemeService', () => {
  let change: (event: MediaQueryListEvent) => void;
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('matchMedia', () => ({
      matches: true,
      addEventListener: (_: string, callback: typeof change) => {
        change = callback;
      },
      removeEventListener: vi.fn(),
    }));
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    localStorage.clear();
  });
  it('follows the system until a manual choice and restores the stored choice', () => {
    const theme = TestBed.inject(ThemeService);
    expect(theme.dark()).toBe(true);
    change({ matches: false } as MediaQueryListEvent);
    expect(theme.dark()).toBe(false);
    theme.toggle();
    expect(document.documentElement.dataset['bsTheme']).toBe('dark');
    expect(localStorage.getItem('color-theme')).toBe('dark');
    change({ matches: false } as MediaQueryListEvent);
    expect(theme.dark()).toBe(true);
    TestBed.resetTestingModule();
    expect(TestBed.inject(ThemeService).dark()).toBe(true);
  });
  it('works when browser storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const theme = TestBed.inject(ThemeService);
    theme.toggle();
    expect(theme.dark()).toBe(false);
    expect(document.documentElement.dataset['theme']).toBe('light');
  });
});
