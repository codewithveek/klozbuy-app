import { Link } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { createStyles } from '../theme/createStyles';

export interface TapState {
  pressed: boolean;
  /** Pointer over the element (web). */
  hovered: boolean;
}

/**
 * Tracks press and hover with handlers rather than Pressable's style function: Expo Router's
 * Link (used for href) only accepts a plain, flattened style on its child.
 */
function useTapState() {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const handlers = {
    onPressIn: () => setPressed(true),
    onPressOut: () => setPressed(false),
    onHoverIn: () => setHovered(true),
    onHoverOut: () => setHovered(false),
  };
  return { state: { pressed, hovered }, handlers };
}

const useStyles = createStyles((theme) => ({
  base: { minHeight: theme.control.touchMin, justifyContent: 'center' },
  disabled: { opacity: theme.opacity.disabled },
}));

export interface KlozTapProps {
  onPress?: () => void;
  /** Navigates with Expo Router; renders a real <a href> on web. */
  href?: string;
  disabled?: boolean;
  /** Toggle state for chips and segments. */
  pressed?: boolean;
  /** Work in progress, e.g. a button waiting for the server. */
  busy?: boolean;
  /** Required when the content has no text. */
  accessibilityLabel?: string;
  /** Default 'link' with href, otherwise 'button'. */
  role?: 'button' | 'link' | 'tab' | 'checkbox' | 'switch';
  testID?: string;
  /** For building Kloz components; receives pressed and hovered state. */
  style?: StyleProp<ViewStyle> | ((state: TapState) => StyleProp<ViewStyle>);
  children: ReactNode | ((state: TapState) => ReactNode);
}

/** The one tappable primitive: press feedback, disabled state, hit size and links. */
export function KlozTap({
  href,
  disabled,
  pressed: selected,
  busy,
  role,
  style,
  children,
  ...rest
}: KlozTapProps) {
  const styles = useStyles();
  const { state, handlers } = useTapState();
  const composed = [
    styles.base,
    disabled && styles.disabled,
    typeof style === 'function' ? style(state) : style,
  ];
  const isLink = !!href && !disabled;
  const pressable = (
    <Pressable
      {...rest}
      {...handlers}
      disabled={disabled}
      role={role ?? (href ? 'link' : 'button')}
      accessibilityState={{ disabled: !!disabled, selected, busy }}
      aria-busy={busy}
      style={isLink ? StyleSheet.flatten(composed) : composed}
    >
      {typeof children === 'function' ? children(state) : children}
    </Pressable>
  );
  if (!isLink) return pressable;
  return (
    <Link href={href} asChild>
      {pressable}
    </Link>
  );
}
