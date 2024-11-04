/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/home` | `/(tabs)/library` | `/(tabs)/notification` | `/(tabs)/profile` | `/(tabs)/search` | `/(tabs)/write` | `/_sitemap` | `/home` | `/library` | `/notification` | `/profile` | `/search` | `/write`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
