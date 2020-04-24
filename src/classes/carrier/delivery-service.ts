import { assert } from "../../assert";
import { Country } from "../../countries";
import { DeliveryServiceClass, DeliveryServiceGrade, LabelFormat, LabelSize, ManifestType, ServiceArea } from "../../enums";
import { DeliveryServicePOJO } from "../../pojos";
import { UUID } from "../../types";
import { App } from "../app";
import { Carrier } from "./carrier";
import { DeliveryConfirmation } from "./delivery-confirmation";
import { Packaging } from "./packaging";

/**
 * A delivery service that is offered by a shipping provider
 */
export class DeliveryService {
  //#region Fields

  /**
   * A UUID that uniquely identifies the delivery service.
   * This ID should never change, even if the service name changes.
   */
  public readonly id: UUID;

  /**
   * The user-friendly service name (e.g. "Priority Overnight", "2-Day Air")
   */
  public readonly name: string;

  /**
   * A short, user-friendly description of the service
   */
  public readonly description: string;

  /**
   * The class of service
   */
  public readonly class: DeliveryServiceClass;

  /**
   * The grade of service
   */
  public readonly grade: DeliveryServiceGrade;

  /**
   * The service area this service covers
   */
  public readonly serviceArea?: ServiceArea;

  /**
   * Indicates whether this service is a consolidation of multiple carrier services
   */
  public readonly isConsolidator: boolean;

  /**
   * TODO: Does this mean that the service is ONLY for return shipping? Or that it ALSO supports return shipping?
   */
  public readonly isReturnService: boolean;

  /**
   * Indicates whether the service allows multiple packages in a single shipment
   */
  public readonly allowsMultiplePackages: boolean;

  /**
   * Indicates whether a tracking number is provided
   */
  public readonly hasTracking: boolean;

  /**
   * Indicates whether the carrier provides a sandbox/development API for this delivery service.
   * A sandbox should mimic real functionality as much as possible but MUST NOT incur any actual
   * costs or affect production data.
   */
  public readonly hasSandbox: boolean;

  /**
   * Indicates whether this service requires a manifest, and if so, what type
   */
  public readonly requiresManifest: false | ManifestType;

  /**
   * The label formats that are offered for this service
   */
  public readonly labelFormats: ReadonlyArray<LabelFormat>;

  /**
   * The label dimensions that are used for this service
   */
  public readonly labelSizes: ReadonlyArray<LabelSize>;

  /**
   * The countries that can be shipped from using this service
   */
  public readonly originCountries: ReadonlyArray<Country>;

  /**
   * The countries that can be shipped to using this service
   */
  public readonly destinationCountries: ReadonlyArray<Country>;

  /**
   * The carrier that provides this service
   */
  public readonly  carrier: Carrier;

  /**
   * The types of packaging that are provided/allowed for this service
   */
  public readonly packaging: ReadonlyArray<Packaging>;

  /**
   * The types of package delivery confirmations offered for this service
   */
  public readonly deliveryConfirmations: ReadonlyArray<DeliveryConfirmation>;

  //#endregion

  //#region Helper properties

  /**
   * All countries that this service ships to or from.
   * This list includes all unique origin and destination countries.
   */
  public get countries(): ReadonlyArray<Country> {
    let countries = new Set(this.originCountries.concat(this.destinationCountries));
    return Object.freeze([...countries]);
  }

  /**
   * Indicates whether the weight may be required when using this service.
   * This property is `true` if any of the service's packaging requires weight.
   */
  public get requiresWeight(): boolean {
    return this.packaging.some((pkg) => pkg.requiresWeight);
  }

  /**
   * Indicates whether the dimensions may be required when using this service.
   * This property is `true` if any of the service's packaging requires dimensions.
   */
  public get requiresDimensions(): boolean {
    return this.packaging.some((pkg) => pkg.requiresDimensions);
  }

  //#endregion

  public constructor(app: App, parent: Carrier, pojo: DeliveryServicePOJO) {
    this.carrier = parent;
    this.id = app._references.add(this, pojo, "delivery service");
    this.name = assert.string.nonWhitespace(pojo.name, "delivery service name");
    this.description = assert.string(pojo.description, "delivery service description", "");
    this.class = assert.string.enum(pojo.class, DeliveryServiceClass, "delivery service class");
    this.grade = assert.string.enum(pojo.grade, DeliveryServiceGrade, "delivery service grade");
    this.serviceArea = pojo.serviceArea && assert.string.enum(pojo.serviceArea, ServiceArea, "service area");
    this.isConsolidator = assert.type.boolean(pojo.isConsolidator, "isConsolidator flag", false);
    this.isReturnService = assert.type.boolean(pojo.isReturnService, "isReturnService flag", false);
    this.allowsMultiplePackages =
      assert.type.boolean(pojo.allowsMultiplePackages, "allowsMultiplePackages flag", false);
    this.hasTracking = assert.type.boolean(pojo.hasTracking, "hasTracking flag", false);
    this.hasSandbox = assert.type.boolean(pojo.hasSandbox, "hasSandbox flag", false);
    this.requiresManifest = pojo.requiresManifest
      ? assert.string.enum(pojo.requiresManifest, ManifestType, "requiresManifest value")
      : false;
    this.labelFormats = assert.array.ofEnum(pojo.labelFormats, LabelFormat, "labelFormats", []);
    this.labelSizes = assert.array.ofEnum(pojo.labelSizes, LabelSize, "labelSizes", []);
    this.originCountries = assert.array.ofEnum(pojo.originCountries, Country, "originCountries");
    this.destinationCountries = assert.array.ofEnum(pojo.destinationCountries, Country, "destinationCountries");
    this.packaging = assert.array.nonEmpty(pojo.packaging, "packaging")
      .map((svc) => app._references.get(svc, Packaging) || new Packaging(app, svc));
    this.deliveryConfirmations = assert.array(pojo.deliveryConfirmations, "deliveryConfirmations", [])
      .map((svc) => app._references.get(svc, DeliveryConfirmation) || new DeliveryConfirmation(app, svc));

    // Prevent modifications after validation
    Object.freeze(this);
    Object.freeze(this.labelFormats);
    Object.freeze(this.labelSizes);
    Object.freeze(this.originCountries);
    Object.freeze(this.destinationCountries);
    Object.freeze(this.packaging);
    Object.freeze(this.deliveryConfirmations);
  }

}