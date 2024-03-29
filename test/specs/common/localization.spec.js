"use strict";

const { CarrierApp } = require("../../../lib/internal");
const { expect } = require("chai");
const pojo = require("../../utils/pojo");

describe("Localization", () => {

  it("should return an identical object if no localization exist", () => {
    let app = new CarrierApp(pojo.carrierApp({
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: "http://example.com/",
      deliveryServices: [
        pojo.deliveryService({
          name: "Delivery Service Name",
          description: "Delivery service description",
          packaging: [
            pojo.packaging({
              name: "Packaging Name",
              description: "Packaging description"
            })
          ],
          deliveryConfirmations: [
            pojo.deliveryConfirmation({
              name: "Confirmation Name",
              description: "Confirmation description"
            })
          ],
        }),
      ],
      pickupServices: [
        pojo.pickupService({
          name: "Pickup Service Name",
          description: "Pickup service description",
        })
      ],
    }));

    // There is no localization, so no matter what langauge is specified,
    // an identical object will be returned
    let localized = app.localize("de");

    expect(localized).to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: new URL("http://example.com/"),
      deliveryServices: [
        {
          ...app.deliveryServices[0],
          name: "Delivery Service Name",
          description: "Delivery service description",
          packaging: [
            {
              ...app.deliveryServices[0].packaging[0],
              name: "Packaging Name",
              description: "Packaging description"
            }
          ],
          deliveryConfirmations: [
            {
              ...app.deliveryServices[0].deliveryConfirmations[0],
              name: "Confirmation Name",
              description: "Confirmation description"
            }
          ],
        },
      ],
      pickupServices: [
        {
          ...app.pickupServices[0],
          name: "Pickup Service Name",
          description: "Pickup service description",
        }
      ],
    });
  });

  it("should return an identical object if no localization is available for the language", () => {
    let app = new CarrierApp(pojo.carrierApp({
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: "http://example.com/",
      localization: {
        es: { name: "Nombre de la compañía" },
        zh: { name: "承运人名称" },
      },
      deliveryServices: [
        pojo.deliveryService({
          name: "Delivery Service Name",
          description: "Delivery service description",
          localization: {
            es: { name: "Nombre del servicio de entrega" },
            zh: { name: "送货服务名称" },
          },
          packaging: [
            pojo.packaging({
              name: "Packaging Name",
              description: "Packaging description",
              localization: {
                es: { name: "Nombre del paquete" },
                zh: { name: "包装名称" },
              },
            })
          ],
          deliveryConfirmations: [
            pojo.deliveryConfirmation({
              name: "Confirmation Name",
              description: "Confirmation description",
              localization: {
                es: { name: "Nombre de confirmación" },
                zh: { name: "确认名称" },
              },
            })
          ],
        }),
      ],
      pickupServices: [
        pojo.pickupService({
          name: "Pickup Service Name",
          description: "Pickup service description",
          localization: {
            es: { name: "Nombre del servicio de recogida" },
            zh: { name: "接送服务名称" },
          },
        })
      ],
    }));

    // There is no German localization, so an identical object will be returned
    let localized = app.localize("de");

    expect(localized).to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: new URL("http://example.com/"),
      deliveryServices: [
        {
          ...app.deliveryServices[0],
          name: "Delivery Service Name",
          description: "Delivery service description",
          packaging: [
            {
              ...app.deliveryServices[0].packaging[0],
              name: "Packaging Name",
              description: "Packaging description"
            }
          ],
          deliveryConfirmations: [
            {
              ...app.deliveryServices[0].deliveryConfirmations[0],
              name: "Confirmation Name",
              description: "Confirmation description"
            }
          ],
        },
      ],
      pickupServices: [
        {
          ...app.pickupServices[0],
          name: "Pickup Service Name",
          description: "Pickup service description",
        }
      ],
    });
  });

  it("should keep the same values for fields that lack localization", () => {
    let app = new CarrierApp(pojo.carrierApp({
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: "http://example.com/",
      localization: {
        es: { name: "Nombre de la compañía" },
        zh: { name: "承运人名称" },
      },
      deliveryServices: [
        pojo.deliveryService({
          name: "Delivery Service Name",
          description: "Delivery service description",
          localization: {
            es: { name: "Nombre del servicio de entrega" },
            zh: { name: "送货服务名称" },
          },
          packaging: [
            pojo.packaging({
              name: "Packaging Name",
              description: "Packaging description",
              localization: {
                es: { name: "Nombre del paquete" },
                zh: { name: "包装名称" },
              },
            })
          ],
          deliveryConfirmations: [
            pojo.deliveryConfirmation({
              name: "Confirmation Name",
              description: "Confirmation description",
              localization: {
                es: { name: "Nombre de confirmación" },
                zh: { name: "确认名称" },
              },
            })
          ],
        }),
      ],
      pickupServices: [
        pojo.pickupService({
          name: "Pickup Service Name",
          description: "Pickup service description",
          localization: {
            es: { name: "Nombre del servicio de recogida" },
            zh: { name: "接送服务名称" },
          },
        })
      ],
    }));

    // Only the names are localized in Chinese, so the descriptions will remain English
    let localized = app.localize("zh");

    expect(localized).not.to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      name: "承运人名称",
      description: "Carrier description",
      websiteURL: new URL("http://example.com/"),
      deliveryServices: [
        {
          ...app.deliveryServices[0],
          name: "送货服务名称",
          description: "Delivery service description",
          packaging: [
            {
              ...app.deliveryServices[0].packaging[0],
              name: "包装名称",
              description: "Packaging description"
            }
          ],
          deliveryConfirmations: [
            {
              ...app.deliveryServices[0].deliveryConfirmations[0],
              name: "确认名称",
              description: "Confirmation description"
            }
          ],
        },
      ],
      pickupServices: [
        {
          ...app.pickupServices[0],
          name: "接送服务名称",
          description: "Pickup service description",
        }
      ],
    });
  });

  it("should use missing values from dialects of a language", () => {
    let app = new CarrierApp(pojo.carrierApp({
      name: "XXXXXXX",
      description: "XXXXXX",
      websiteURL: "http://XXXXXX.XXXXXX/",
      localization: {
        en: {
          name: "Carrier Name"
        },
        "en-GB": {
          name: "YYYYYYYYYYYY",
          description: "Carrier description",
        },
        "en-US": {
          name: "ZZZZZZZZZZZZZ",
          description: "ZZZZZZZZZZZZZ",
          websiteURL: "https://example.com/en/",
        },
      },
      deliveryServices: [
        pojo.deliveryService({
          name: "XXXXXXXXXXXX",
          description: "XXXXXXXXXXXXXX",
          localization: {
            en: {
              name: "Delivery Service Name"
            },
            "en-GB": {
              name: "YYYYYYYYYYYY",
              description: "Delivery service description",
            },
            "en-US": {
              name: "ZZZZZZZZZZZZZ",
              description: "ZZZZZZZZZZZZZZZZ",
            },
          },
          packaging: [
            pojo.packaging({
              name: "XXXXXXXXXXXXXXX",
              description: "XXXXXXXXXXXXXX",
              localization: {
                "en-GB": {
                  description: "Packaging description",
                },
                "en-US": {
                  name: "Packaging Name",
                  description: "ZZZZZZZZZZZZZZZZ",
                },
              },
            })
          ],
          deliveryConfirmations: [
            pojo.deliveryConfirmation({
              name: "XXXXXXXXXXXXXXXXXXXX",
              description: "XXXXXXXXXXXXXXXXXX",
              localization: {
                en: {
                  name: "Confirmation Name",
                },
                "en-GB": {
                  description: "Confirmation description",
                },
                "en-US": {
                  description: "ZZZZZZZZZZZZZZZZ",
                },
              },
            })
          ],
        }),
      ],
      pickupServices: [
        pojo.pickupService({
          name: "XXXXXXXXXXXXX",
          description: "XXXXXXXXXXXXXXXXX",
          localization: {
            "en-GB": {
              description: "Pickup service description",
            },
            "en-US": {
              name: "Pickup Service Name",
              description: "ZZZZZZZZZZZZZZZZ",
            },
          },
        })
      ],
    }));

    // Sine we're just specifying "en" here, it will first use the "en" values,
    // and will fill-in any missing values using "en-GB" and "en-US"
    let localized = app.localize("en");

    expect(localized).not.to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: new URL("https://example.com/en/"),
      deliveryServices: [
        {
          ...app.deliveryServices[0],
          name: "Delivery Service Name",
          description: "Delivery service description",
          packaging: [
            {
              ...app.deliveryServices[0].packaging[0],
              name: "Packaging Name",
              description: "Packaging description"
            }
          ],
          deliveryConfirmations: [
            {
              ...app.deliveryServices[0].deliveryConfirmations[0],
              name: "Confirmation Name",
              description: "Confirmation description"
            }
          ],
        },
      ],
      pickupServices: [
        {
          ...app.pickupServices[0],
          name: "Pickup Service Name",
          description: "Pickup service description",
        }
      ],
    });
  });

  it("should use missing values from the generic language localization", () => {
    let app = new CarrierApp(pojo.carrierApp({
      name: "XXXXXXX",
      description: "XXXXXX",
      websiteURL: "http://XXXXXX.XXXXXX/",
      localization: {
        en: {
          name: "Carrier Name",
          description: "ZZZZZZZZZZZZZZZZ",
          websiteURL: "https://example.com/en/",
        },
        "en-GB": {
          description: "Carrier description",
        },
        "en-US": {
          name: "ZZZZZZZZZZZZZ",
          description: "ZZZZZZZZZZZZZ",
          websiteURL: "https://ZZZZZZZZZ.ZZZZZZ/",
        },
      },
      deliveryServices: [
        pojo.deliveryService({
          name: "XXXXXXXXXXXX",
          description: "XXXXXXXXXXXXXX",
          localization: {
            en: {
              name: "Delivery Service Name",
              description: "ZZZZZZZZZZZZZZZZ",
            },
            "en-GB": {
              description: "Delivery service description",
            },
            "en-US": {
              name: "ZZZZZZZZZZZZZ",
              description: "ZZZZZZZZZZZZZZZZ",
            },
          },
          packaging: [
            pojo.packaging({
              name: "XXXXXXXXXXXXXXX",
              description: "XXXXXXXXXXXXXX",
              localization: {
                en: {
                  name: "Packaging Name",
                },
                "en-GB": {
                  description: "Packaging description",
                },
                "en-US": {
                  name: "ZZZZZZZZZZZZZ",
                  description: "ZZZZZZZZZZZZZZZZ",
                },
              },
            })
          ],
          deliveryConfirmations: [
            pojo.deliveryConfirmation({
              name: "XXXXXXXXXXXXXXXXXXXX",
              description: "XXXXXXXXXXXXXXXXXX",
              localization: {
                en: {
                  description: "Confirmation description",
                },
                "en-GB": {
                  name: "Confirmation Name",
                },
                "en-US": {
                  description: "ZZZZZZZZZZZZZZZZ",
                },
              },
            })
          ],
        }),
      ],
      pickupServices: [
        pojo.pickupService({
          name: "XXXXXXXXXXXXX",
          description: "XXXXXXXXXXXXXXXXX",
          localization: {
            en: {
              name: "Pickup Service Name",
              description: "Pickup service description",
            },
            "en-US": {
              name: "ZZZZZZZZZZZZZZZZ",
              description: "ZZZZZZZZZZZZZZZZ",
            },
          },
        })
      ],
    }));

    // Since we're specifying "en-GB" here, it will fill-in any missing
    // keys from the fallback "en" localizations
    let localized = app.localize("en-GB");

    expect(localized).not.to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      name: "Carrier Name",
      description: "Carrier description",
      websiteURL: new URL("https://example.com/en/"),
      deliveryServices: [
        {
          ...app.deliveryServices[0],
          name: "Delivery Service Name",
          description: "Delivery service description",
          packaging: [
            {
              ...app.deliveryServices[0].packaging[0],
              name: "Packaging Name",
              description: "Packaging description"
            }
          ],
          deliveryConfirmations: [
            {
              ...app.deliveryServices[0].deliveryConfirmations[0],
              name: "Confirmation Name",
              description: "Confirmation description"
            }
          ],
        },
      ],
      pickupServices: [
        {
          ...app.pickupServices[0],
          name: "Pickup Service Name",
          description: "Pickup service description",
        }
      ],
    });
  });

  it("should localize complex values", () => {
    let app = new CarrierApp(pojo.carrierApp({
      connectionForm: {
        dataSchema: {
          title: "Login",
          description: "Login to your account",
          properties: {
            username: {
              title: "Username",
              type: "string"
            },
            passwrod: {
              title: "Password",
              type: "string"
            }
          }
        },
        uiSchema: {
          username: {
            "ui:widget": "text",
            "ui:autofocus": true,
          },
          password: {
            "ui:widget": "password",
            "ui:help": "Note: password is case sensitive"
          },
        },
        localization: {
          zh: {
            dataSchema: {
              title: "登录",
              description: "登录到您的帐户",
              properties: {
                username: {
                  title: "用户名",
                },
                passwrod: {
                  title: "密码",
                }
              }
            },
            uiSchema: {
              password: {
                "ui:help": "注意：密码区分大小写"
              }
            }
          }
        }
      }
    }));

    let localized = app.localize("zh-CN");

    expect(localized).not.to.deep.equal(app);

    expect(localized).to.deep.equal({
      ...app,
      connectionForm: {
        ...app.connectionForm,
        dataSchema: {
          title: "登录",
          description: "登录到您的帐户",
          properties: {
            username: {
              title: "用户名",
              type: "string"
            },
            passwrod: {
              title: "密码",
              type: "string"
            }
          }
        },
        uiSchema: {
          username: {
            "ui:widget": "text",
            "ui:autofocus": true,
          },
          password: {
            "ui:widget": "password",
            "ui:help": "注意：密码区分大小写"
          },
        },
      }
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if no langauge tag is specified", () => {
      let app = new CarrierApp(pojo.carrierApp());
      expect(() => app.localize()).to.throw(
        "Invalid locale: \n" +
        "  A value is required"
      );
    });

    it("should throw an error if an invalid langauge tag is specified", () => {
      let app = new CarrierApp(pojo.carrierApp());
      expect(() => app.localize("XX")).to.throw(
        "Invalid locale: \n" +
        '  value must be a valid language code, like "en" or "en-US"'
      );
    });

  });
});
