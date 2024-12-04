/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/context/AuthContext` | `/tabs` | `/tabs/` | `/tabs/home` | `/tabs/library` | `/tabs/login` | `/tabs/notification` | `/tabs/notifications` | `/tabs/profile` | `/tabs/register` | `/tabs/search` | `/tabs/settings` | `/tabs/userprofile` | `/tabs/write` | `/util/storage`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
