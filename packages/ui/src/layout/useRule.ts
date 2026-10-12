import { Platform, useWindowDimensions, type ViewStyle } from 'react-native';
import { nativeRuleStyle, type ResponsiveRule } from './rules';
import './web-props';

export interface RuleProps {
  dataSet?: Record<string, string>;
  style?: ViewStyle;
  /** False when a show rule hides the element on this native screen. */
  visible: boolean;
}

/** Turns responsive rules into a data attribute (web) or a style (native). */
export function useResponsive(rules: ResponsiveRule | ResponsiveRule[] | undefined): RuleProps {
  const { width } = useWindowDimensions();
  if (!rules) return { visible: true };
  const list = Array.isArray(rules) ? rules : [rules];
  if (Platform.OS === 'web') return { dataSet: { k: list.join(' ') }, visible: true };
  const styles = list.map((rule) => nativeRuleStyle(rule, width));
  if (styles.includes(null)) return { visible: false };
  return { style: Object.assign({}, ...styles) as ViewStyle, visible: true };
}
