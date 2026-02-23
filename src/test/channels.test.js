import { describe, it, expect } from 'vitest';
import { CHANNELS, STREAMING_SERVICES, CATEGORY_META, CATEGORIES_ORDER, LANGUAGE_FILTERS } from '../channels';

describe('channels data', () => {
  it('has channels defined', () => {
    expect(CHANNELS.length).toBeGreaterThan(0);
  });

  it('every channel has required fields', () => {
    CHANNELS.forEach(ch => {
      expect(ch.id).toBeTruthy();
      expect(ch.name).toBeTruthy();
      expect(ch.country).toMatch(/^[A-Z]{2}$/);
      expect(ch.categories.length).toBeGreaterThan(0);
      expect(ch.languages.length).toBeGreaterThan(0);
    });
  });

  it('channel IDs are unique', () => {
    const ids = CHANNELS.map(ch => ch.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all channel categories exist in CATEGORY_META', () => {
    const allCats = new Set(CHANNELS.flatMap(ch => ch.categories));
    allCats.forEach(cat => {
      expect(CATEGORY_META[cat]).toBeDefined();
    });
  });

  it('all channel languages are valid ISO 639-3 codes (3 letters)', () => {
    CHANNELS.forEach(ch => {
      ch.languages.forEach(lang => {
        expect(lang).toMatch(/^[a-z]{3}$/);
      });
    });
  });

  it('stream URLs end with .m3u8 when present', () => {
    CHANNELS.filter(ch => ch.streamUrl).forEach(ch => {
      expect(ch.streamUrl).toMatch(/\.m3u8/);
    });
  });
});

describe('streaming services', () => {
  it('has services defined', () => {
    expect(STREAMING_SERVICES.length).toBeGreaterThan(0);
  });

  it('every service has required fields', () => {
    STREAMING_SERVICES.forEach(svc => {
      expect(svc.id).toBeTruthy();
      expect(svc.name).toBeTruthy();
      expect(svc.color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(svc.link).toMatch(/^https:\/\//);
      expect(svc.fireTvPkg).toBeTruthy();
    });
  });

  it('service IDs are unique', () => {
    const ids = STREAMING_SERVICES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('categories and languages config', () => {
  it('CATEGORIES_ORDER contains valid keys', () => {
    CATEGORIES_ORDER.forEach(cat => {
      expect(CATEGORY_META[cat]).toBeDefined();
    });
  });

  it('LANGUAGE_FILTERS includes "all"', () => {
    expect(LANGUAGE_FILTERS.find(l => l.code === 'all')).toBeDefined();
  });

  it('every language filter has code and label', () => {
    LANGUAGE_FILTERS.forEach(l => {
      expect(l.code).toBeTruthy();
      expect(l.label).toBeTruthy();
    });
  });
});
