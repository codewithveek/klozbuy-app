/**
 * Line icons on a 24px grid, drawn in the style of Lucide (ISC licence). Each icon is a
 * list of shapes; KlozIcon renders them with react-native-svg in the current text colour.
 */

export type IconShape =
  | { kind: 'path'; d: string; filled?: boolean }
  | { kind: 'circle'; cx: number; cy: number; r: number };

export const ICONS = {
  pin: [
    { kind: 'path', d: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z' },
    { kind: 'circle', cx: 12, cy: 10, r: 2.5 },
  ],
  search: [
    { kind: 'circle', cx: 11, cy: 11, r: 7 },
    { kind: 'path', d: 'm20 20-3.5-3.5' },
  ],
  'chevron-down': [{ kind: 'path', d: 'm6 9 6 6 6-6' }],
  'chevron-right': [{ kind: 'path', d: 'm9 6 6 6-6 6' }],
  bell: [
    { kind: 'path', d: 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' },
    { kind: 'path', d: 'M10.3 21a1.94 1.94 0 0 0 3.4 0' },
  ],
  chat: [{ kind: 'path', d: 'M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z' }],
  phone: [
    {
      kind: 'path',
      d: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2',
    },
  ],
  navigate: [{ kind: 'path', d: 'm3 11 18-8-8 18-2-8z' }],
  heart: [
    { kind: 'path', d: 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z' },
  ],
  'shield-check': [
    { kind: 'path', d: 'M12 3 5 6v6c0 4.4 3 7.8 7 9 4-1.2 7-4.6 7-9V6z' },
    { kind: 'path', d: 'm9 12 2 2 4-4' },
  ],
  star: [
    {
      kind: 'path',
      d: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
      filled: true,
    },
  ],
  'check-circle': [
    { kind: 'circle', cx: 12, cy: 12, r: 9 },
    { kind: 'path', d: 'm8 12 3 3 5-6' },
  ],
  clock: [
    { kind: 'circle', cx: 12, cy: 12, r: 9 },
    { kind: 'path', d: 'M12 7v5l3 2' },
  ],
  plus: [{ kind: 'path', d: 'M12 5v14M5 12h14' }],
  x: [{ kind: 'path', d: 'M6 6l12 12M18 6 6 18' }],
  store: [
    { kind: 'path', d: 'M3 9l1.5-5h15L21 9' },
    { kind: 'path', d: 'M4 9v11h16V9' },
    { kind: 'path', d: 'M3 9h18' },
    { kind: 'path', d: 'M9 20v-6h6v6' },
  ],
  wrench: [
    {
      kind: 'path',
      d: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z',
    },
  ],
  megaphone: [
    { kind: 'path', d: 'M3 11v2a1 1 0 0 0 1 1h3l5 4V6L7 10H4a1 1 0 0 0-1 1z' },
    { kind: 'path', d: 'M16 8a5 5 0 0 1 0 8' },
  ],
  bookmark: [{ kind: 'path', d: 'M6 3h12v18l-6-4-6 4z' }],
  user: [
    { kind: 'circle', cx: 12, cy: 8, r: 4 },
    { kind: 'path', d: 'M4 21a8 8 0 0 1 16 0' },
  ],
  compass: [
    { kind: 'circle', cx: 12, cy: 12, r: 9 },
    { kind: 'path', d: 'm15.5 8.5-2 5-5 2 2-5z' },
  ],
  share: [
    { kind: 'circle', cx: 18, cy: 5, r: 2.5 },
    { kind: 'circle', cx: 6, cy: 12, r: 2.5 },
    { kind: 'circle', cx: 18, cy: 19, r: 2.5 },
    { kind: 'path', d: 'm8.2 10.8 7.6-4.6M8.2 13.2l7.6 4.6' },
  ],
  map: [
    { kind: 'path', d: 'M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z' },
    { kind: 'path', d: 'M9 4v14M15 6v14' },
  ],
  eye: [
    { kind: 'path', d: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z' },
    { kind: 'circle', cx: 12, cy: 12, r: 3 },
  ],
  'arrow-up': [{ kind: 'path', d: 'M12 19V5M5 12l7-7 7 7' }],
  'arrow-down': [{ kind: 'path', d: 'M12 5v14M5 12l7 7 7-7' }],
  tag: [
    { kind: 'path', d: 'M3 12V4h8l10 10-8 8z' },
    { kind: 'circle', cx: 7.5, cy: 7.5, r: 1.5 },
  ],
  camera: [
    { kind: 'path', d: 'M4 8h3l2-3h6l2 3h3v11H4z' },
    { kind: 'circle', cx: 12, cy: 13, r: 3.5 },
  ],
  alert: [
    { kind: 'path', d: 'M12 3 2 20h20z' },
    { kind: 'path', d: 'M12 10v4M12 17h.01' },
  ],
} as const satisfies Record<string, readonly IconShape[]>;

export type IconName = keyof typeof ICONS;
