import { colors, FONT_FAMILY, GRID_CSS, RESPONSIVE_CSS } from '@klozbuy/ui';
import { ScrollViewStyleReset, useServerDocumentContext } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const FONT_URL = '/fonts/PlusJakartaSans-Variable.woff2';

/**
 * Document-level CSS: the font, the page background, a visible keyboard focus ring, and the
 * media queries behind Kloz's responsive layout (so the server render fits every width).
 */
const globalCss = `
@font-face {
  font-family: '${FONT_FAMILY}';
  src: url('${FONT_URL}') format('woff2');
  font-weight: 200 800;
  font-display: swap;
}
body { background-color: ${colors.light.bgCanvas}; }
:focus-visible { outline: 2px solid ${colors.light.focusRing}; outline-offset: 2px; }
${RESPONSIVE_CSS}
${GRID_CSS}
`;

/** Wraps every server-rendered page. Runs on the server only. */
export default function Root({ children }: PropsWithChildren) {
  const { htmlAttributes, bodyAttributes, headNodes, bodyNodes } = useServerDocumentContext();
  return (
    <html lang="en-NG" {...htmlAttributes}>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content={colors.light.actionPrimary} />
        <link rel="preload" href={FONT_URL} as="font" type="font/woff2" crossOrigin="" />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
        {headNodes}
      </head>
      <body {...bodyAttributes}>
        {children}
        {bodyNodes}
      </body>
    </html>
  );
}
