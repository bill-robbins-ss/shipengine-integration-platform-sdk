import { assert } from "../assert";
import { AppManifestPOJO } from "../pojos";
import { ReferenceMap } from "./reference-map";

const versionNumberPattern = /^\d+\.\d+\.\d+/;
versionNumberPattern.example = "1.23.456";

/**
 * A ShipEngine IPaaS app
 */
export abstract class App {
  /**
   * Keeps track of distinct Config object references and UUIDs
   * @internal
   */
  public readonly _references = new ReferenceMap();

  /**
   * The ShipEngine IPaaS shipping provider app version number.
   * This is a semantic version number (e.g. "1.23.456")
   */
  public readonly version: string;

  public constructor(manifest: AppManifestPOJO) {
    assert.type.object(manifest, "app manifest");
    this.version = assert.string.pattern(manifest.version, versionNumberPattern, "app version number");
  }
}