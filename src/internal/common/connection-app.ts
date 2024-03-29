import { Connect, ConnectionApp as IConnectionApp, ConnectionAppPOJO, ErrorCode, FilePath, LocalizedBrandingPOJO, TransactionPOJO } from "../../public";
import { App } from "./app";
import { error } from "./errors";
import { Form } from "./form";
import { Localization } from "./localization";
import { Transaction } from "./transaction";
import { _internal } from "./utils";
import { Joi, validate } from "./validation";

const _private = Symbol("private fields");

export abstract class ConnectionApp extends App implements IConnectionApp {
  public static readonly [_internal] = {
    label: "ShipEngine Integration Platform app",
    schema: App[_internal].schema.keys({
      name: Joi.string().trim().singleLine().min(1).max(100).required(),
      description: Joi.string().trim().singleLine().allow("").max(1000),
      websiteURL: Joi.string().website().required(),
      logo: Joi.string().filePath({ ext: ".svg" }).required(),
      connectionForm: Form[_internal].schema.required(),
      settingsForm: Form[_internal].schema,
      localization: Joi.object().localization({
        name: Joi.string().trim().singleLine().allow("").max(100),
        description: Joi.string().trim().singleLine().allow("").max(1000),
        websiteURL: Joi.string().website(),
      }),
      connect: Joi.function().required(),
    }),
  };

  private readonly [_private]: {
    readonly localization: Localization<LocalizedBrandingPOJO>;
    readonly connect: Connect;
  };

  public readonly name: string;
  public readonly description: string;
  public readonly websiteURL: URL;
  public readonly logo: FilePath;
  public readonly connectionForm: Form;
  public readonly settingsForm?: Form;

  public constructor(pojo: ConnectionAppPOJO) {
    super(pojo);

    this.name = pojo.name;
    this.description = pojo.description || "";
    this.websiteURL = new URL(pojo.websiteURL);
    this.logo =  pojo.logo;
    this.connectionForm = new Form(pojo.connectionForm);
    this.settingsForm = pojo.settingsForm && new Form(pojo.settingsForm);

    this[_private] = {
      localization: new Localization(pojo.localization || {}),
      connect: pojo.connect,
    };
  }

  public toJSON(locale?: string): ConnectionAppPOJO {
    let { localization, connect } = this[_private];
    let localizedValues = locale ? localization.lookup(locale) : {};

    return {
      ...super.toJSON(),
      name: this.name,
      description: this.description,
      logo: this.logo,
      websiteURL: this.websiteURL.href,
      connectionForm: this.connectionForm.toJSON(locale),
      settingsForm: this.settingsForm && this.settingsForm.toJSON(locale),
      connect,
      localization: localization.toJSON(),
      ...localizedValues,
    };
  }

  public async connect(transaction: TransactionPOJO, connectionFormData: object): Promise<void> {
    let _transaction, _connectionFormData;
    let { connect } = this[_private];

    try {
      _transaction = new Transaction(validate(transaction, Transaction));
      _connectionFormData = Object.assign({}, connectionFormData);
    }
    catch (originalError) {
      throw error(ErrorCode.InvalidInput, "Invalid input to the connect method.", { originalError });
    }

    try {
      await connect(_transaction, _connectionFormData);
    }
    catch (originalError) {
      let transactionID = _transaction.id;
      throw error(ErrorCode.AppError, `Error in the connect method.`, { originalError, transactionID });
    }
  }
}
