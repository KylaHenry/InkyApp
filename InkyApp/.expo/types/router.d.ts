/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/tabs` | `/tabs/` | `/tabs/home` | `/tabs/library` | `/tabs/login` | `/tabs/notification` | `/tabs/notifications` | `/tabs/profile` | `/tabs/search` | `/tabs/settings` | `/tabs/userprofile` | `/tabs/write`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
