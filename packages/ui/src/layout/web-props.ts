/**
 * react-native-web renders `dataSet` as data-* attributes; React Native's types don't list
 * it. The responsive rules and grid use it on web only.
 */
declare module 'react-native' {
  interface ViewProps {
    dataSet?: Record<string, string>;
  }
}

export {};
