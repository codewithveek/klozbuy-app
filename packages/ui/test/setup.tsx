import { cleanup } from '@testing-library/react';
import { cloneElement, createElement, isValidElement, type ReactNode } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(cleanup);

// Expo Router needs a native navigation tree; its Link only has to pass href to its child here.
vi.mock('expo-router', () => ({
  Link: ({ href, children }: { href: string; children: ReactNode }) =>
    isValidElement<{ href?: string }>(children) ? cloneElement(children, { href }) : children,
}));

// Plain SVG elements stand in for react-native-svg.
vi.mock('react-native-svg', () => {
  const element = (tag: string) => (props: Record<string, unknown>) => createElement(tag, props);
  return { default: element('svg'), Circle: element('circle'), Path: element('path') };
});
