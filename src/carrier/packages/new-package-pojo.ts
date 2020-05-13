import { DimensionsPOJO, MonetaryValuePOJO, WeightPOJO } from "../../common";
import { UUID } from "../../types";
import { NewLabelPOJO } from "./new-label";
import { PackageItemPOJO } from "./package-item-pojo";

/**
 * The package information needed when creating a new shipment
 */
export interface NewPackagePOJO {
  /**
   * The ID of the packaging used
   */
  packagingID: UUID;

  /**
   * The package dimensions
   */
  dimensions?: DimensionsPOJO;

  /**
   * The package weight
   */
  weight?: WeightPOJO;

  /**
   * The insured value of this package
   */
  insuredValue?: MonetaryValuePOJO;

  /**
   * Indicates whether the package contains alcohol
   */
  containsAlcohol?: boolean;

  /**
   * Indicates whether the
   */
  isNonMachineable?: boolean;

  /**
   * Label preferences for this package
   */
  label: NewLabelPOJO;

  /**
   * Describes the items inside the package
   */
  contents?: PackageItemPOJO[];
}