"use strict";

const { CarrierApp } = require("../../../lib");
const pojo = require("../../utils/pojo");
const { expect, assert } = require("chai");

describe("schedulePickup", () => {

  it("should return a PickupConfirmation from minimal return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        pickupServices: [pojo.pickupService()],
        schedulePickup: () => ({
          confirmationID: "ABCDEF-123456",
          timeWindows: [{
            startDateTime: new Date("2005-05-05T05:05:05.005Z"),
            endDateTime: new Date("2005-05-05T05:05:05.005Z"),
          }],
          charges: [{
            type: "pickup",
            amount: {
              value: 12.34,
              currency: "AUD",
            }
          }]
        })
      }),
    }));

    let confirmation = await app.carrier.schedulePickup(pojo.transaction(), pojo.pickupRequest());

    expect(confirmation).to.deep.equal({
      confirmationID: "ABCDEF-123456",
      identifiers: [],
      notes: "",
      customData: undefined,
      timeWindows: [{
        startDateTime: new Date("2005-05-05T05:05:05.005Z"),
        endDateTime: new Date("2005-05-05T05:05:05.005Z"),
      }],
      charges: [{
        name: "",
        description: "",
        code: "",
        notes: "",
        type: "pickup",
        amount: {
          value: "12.34",
          currency: "AUD",
        }
      }],
      shipments: [confirmation.shipments[0]],
      totalAmount: {
        value: "12.34",
        currency: "AUD",
      }
    });
  });

  it("should return a PickupConfirmation from all possible return values", async () => {
    let app = new CarrierApp(pojo.carrierApp({
      carrier: pojo.carrier({
        pickupServices: [pojo.pickupService()],
        schedulePickup: () => ({
          confirmationID: "ABCDEF-123456",
          identifiers: [{
            name: "Pickup ID",
            id: "123456-ABCDEFG",
          }],
          timeWindows: [{
            startDateTime: new Date("2005-05-05T05:05:05.005Z"),
            endDateTime: new Date("2005-05-05T05:05:05.005Z"),
          }],
          charges: [
            {
              name: "Pickup Charge",
              description: "Charge for pickup",
              code: "PIK",
              notes: "This is a note",
              type: "pickup",
              amount: {
                value: 12.34,
                currency: "AUD",
              }
            },
            {
              name: "Pickup Tax",
              description: "Taxes for pickup",
              code: "TAX",
              notes: "This is a note",
              type: "tax",
              amount: {
                value: 2.5,
                currency: "AUD",
              }
            },
          ],
          shipments: [{
            trackingNumber: "1234567890",
            identifiers: [{
              name: "Shipment ID",
              id: "1234567890-ABCDEFG",
            }]
          }],
          notes: "this is a note",
          customData: {
            foo: "bar",
            biz: "baz",
          }
        })
      }),
    }));

    let confirmation = await app.carrier.schedulePickup(pojo.transaction(), pojo.pickupRequest());

    expect(confirmation).to.deep.equal({
      confirmationID: "ABCDEF-123456",
      identifiers: [{
        name: "Pickup ID",
        id: "123456-ABCDEFG",
      }],
      timeWindows: [{
        startDateTime: new Date("2005-05-05T05:05:05.005Z"),
        endDateTime: new Date("2005-05-05T05:05:05.005Z"),
      }],
      charges: [
        {
          name: "Pickup Charge",
          description: "Charge for pickup",
          code: "PIK",
          notes: "This is a note",
          type: "pickup",
          amount: {
            value: "12.34",
            currency: "AUD",
          }
        },
        {
          name: "Pickup Tax",
          description: "Taxes for pickup",
          code: "TAX",
          notes: "This is a note",
          type: "tax",
          amount: {
            value: "2.50",
            currency: "AUD",
          }
        },
      ],
      totalAmount: {
        value: "14.84",
        currency: "AUD",
      },
      shipments: [{
        trackingNumber: "1234567890",
        identifiers: [{
          name: "Shipment ID",
          id: "1234567890-ABCDEFG",
        }]
      }],
      notes: "this is a note",
      customData: {
        foo: "bar",
        biz: "baz",
      }
    });
  });

  describe("Failure tests", () => {

    it("should throw an error if called with no arguments", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          schedulePickup () {}
        }),
      }));

      try {
        await app.carrier.schedulePickup();
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the schedulePickup method. \n" +
          "Invalid transaction: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without a PickupRequest", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          schedulePickup () {}
        }),
      }));

      try {
        await app.carrier.schedulePickup(pojo.transaction());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the schedulePickup method. \n" +
          "Invalid pickup request: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if called without an invalid PickupRequest", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          schedulePickup () {}
        }),
      }));

      try {
        await app.carrier.schedulePickup(pojo.transaction(), {
          pickupServiceID: "Come get it",
          timeWindow: {
            startDateTime: "2005-05-05T05:05:05.005Z",
            endDateTime: Date.now(),
          },
          notes: 5,
          shipments: [],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the schedulePickup method. \n" +
          "Invalid pickup request: \n" +
          "  pickupServiceID must be a valid GUID \n" +
          "  timeWindow.startDateTime must be a valid date \n" +
          "  timeWindow.endDateTime must be a valid date \n" +
          "  address is required \n" +
          "  contact is required \n" +
          "  notes must be a string \n" +
          "  shipments must contain at least 1 items"
        );
      }
    });

    it("should throw an error if called with an invalid pickupServiceID", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          schedulePickup () {}
        }),
      }));

      try {
        await app.carrier.schedulePickup(pojo.transaction(), {
          pickupServiceID: "22222222-2222-2222-2222-222222222222",
          timeWindow: {
            startDateTime: new Date(),
            endDateTime: new Date(),
          },
          address: pojo.address(),
          contact: pojo.contactInfo(),
          shipments: [pojo.shipment()],
        });
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Invalid input to the schedulePickup method. \n" +
          "22222222-2222-2222-2222-222222222222 is a delivery service ID not a pickup service ID"
        );
      }
    });

    it("should throw an error if nothing is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          pickupServices: [pojo.pickupService()],
          schedulePickup () {}
        }),
      }));

      try {
        await app.carrier.schedulePickup(pojo.transaction(), pojo.pickupRequest());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in schedulePickup method. \n" +
          "Invalid pickup confirmation: \n" +
          "  A value is required"
        );
      }
    });

    it("should throw an error if an invalid PickupConfirmation is returned", async () => {
      let app = new CarrierApp(pojo.carrierApp({
        carrier: pojo.carrier({
          pickupServices: [pojo.pickupService()],
          schedulePickup: () => ({
            confirmationID: 12345,
            timeWindows: [],
            notes: true,
            customData: {
              foo: false,
            }
          })
        }),
      }));

      try {
        await app.carrier.schedulePickup(pojo.transaction(), pojo.pickupRequest());
        assert.fail("An error should have been thrown");
      }
      catch (error) {
        expect(error.message).to.equal(
          "Error in schedulePickup method. \n" +
          "Invalid pickup confirmation: \n" +
          "  confirmationID must be a string \n" +
          "  timeWindows must contain at least 1 items \n" +
          "  charges is required \n" +
          "  notes must be a string \n" +
          "  customData.foo must be a string"
        );
      }
    });

  });
});