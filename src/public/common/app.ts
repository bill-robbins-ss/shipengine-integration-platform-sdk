import type { AppType } from "./enums";
import type { Localizable } from "./localization";
import type { UUID } from "./types";


/**
 * A ShipEngine Integration Platform app
 */
export interface AppDefinition {
  /**
   * A UUID that uniquely identifies the carrier.
   * This ID should never change.
   */
  id: UUID;
}


/**
 * A ShipEngine Integration Platform app
 */
export interface AppPOJO extends AppDefinition {
  manifest: AppManifestPOJO;
}


/**
 * A ShipEngine Integration Platform app
 */
export interface App extends Localizable<App, AppPOJO> {
  /**
   * The type of app this is
   */
  readonly type: AppType;

  /**
   * A UUID that uniquely identifies the connection.
   * This ID should never change, even if the connection name changes.
   */
  readonly id: UUID;

  /**
   * The app manifest (package.json file)
   */
  readonly manifest: AppManifest;

  /**
   * The versio nof the ShipEngine Integration Platform SDK that the app was built for.
   * This is the major and minor version number, parsed as a float.
   */
  readonly sdkVersion: number;
}


/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppManifestPOJO {
  name: string;
  version: string;
  description?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}


/**
 * A ShipEngine Integration Platform app manifest (package.json file)
 */
export interface AppManifest {
  name: string;
  version: string;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  [key: string]: unknown;
}
