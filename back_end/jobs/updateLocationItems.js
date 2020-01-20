const LocationItem  = require('../models/locationItem/locationItem');
const Receipt       = require('../models/receipt/receipt');
const ReceiptItem   = require('../models/receiptItem/receiptItem');
const SystemItem    = require('../models/systemItem/systemItem');
const Job           = require('./job');

module.exports = class UpdateLocationItems extends Job {
    /**
     * Clears all existing location items, and re-calculates them
     * by finding the average price of a system item at each location.
     * @returns {Promise} Resolves when the job has completed.
     */
    static job() {
        // Mapping from receipt _ids to receipts
        let receipts = {};
        // Mapping from receipt item _ids to receipt items
        let receiptItems = {};
        // Mapping from system item _ids to system items
        let systemItems = {};
        // Mapping from location ids to mapping from name to mapping from tag to [<average price>, <count>]
        let locationItems = {};

        return LocationItem.deleteMany().then(() => {  // Delete all location items
            return Receipt.find({ date: { $lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 14)) }, _locationId: { $ne: null } });
        }).then((r) => { // All receipts in the last two weeks which belong to a location
            let receiptIds = [];

            r.forEach((receipt) => {
                receipts[receipt._id] = receipt;
                locationItems[receipt._locationId] = {};
                receiptIds.push(receipt._id);
            });

            return ReceiptItem.find({ _receiptId: { $in: receiptIds } });
        }).then((r) => {    // All receipt items which belong to those receipts
            let systemItemIds = [];

            r.forEach((receiptItem) => {
                receiptItems[receiptItem._id] = receiptItem;
                systemItemIds.push(receiptItem._systemItemId);
            });

            return SystemItem.find({ _id: { $in: systemItemIds } });
        }).then((s) => {    // All system items for those receipt items
            s.forEach((systemItem) => {
                systemItems[systemItem._id] = systemItem;
            });

            for (let key in receiptItems) {
                if (receiptItems.hasOwnProperty(key)) {
                    let receiptItem = receiptItems[key];
                    let receipt = receipts[receiptItem._receiptId];
                    let systemItem = systemItems[receiptItem._systemItemId];

                    if (locationItems[receipt._locationId] == null) {
                        locationItems[receipt._locationId] = {};
                    }

                    if (locationItems[receipt._locationId][systemItem.name] == null) {
                        locationItems[receipt._locationId][systemItem.name] = {};
                    }

                    if (locationItems[receipt._locationId][systemItem.name][systemItem.tag] == null) {
                        locationItems[receipt._locationId][systemItem.name][systemItem.tag] = [0, 0];
                    }

                    // Calculate the new average price of the system item
                    let priceAndCount = locationItems[receipt._locationId][systemItem.name][systemItem.tag];
                    let price = priceAndCount[0];
                    let count = priceAndCount[1];

                    priceAndCount[0] = (price * count + receiptItem.price) / (count + 1);
                    priceAndCount[1] = count + 1;
                }
            }

            let locationItemDocs = [];

            for (let locationId in locationItems) {
                if (locationItems.hasOwnProperty(locationId)) {
                    for (let name in locationItems[locationId]) {
                        if (locationItems[locationId].hasOwnProperty(name)) {
                            for (let tag in locationItems[locationId][name]) {
                                if (locationItems[locationId][name].hasOwnProperty(tag)) {
                                    locationItemDocs.push({
                                        _locationId: locationId,
                                        name: name,
                                        tag: tag,
                                        price: locationItems[locationId][name][tag][0]
                                    });
                                }
                            }
                        }
                    }
                }
            }

            return LocationItem.insertMany(locationItemDocs);
        });
    }

    static getName() {
        return 'UpdateLocationItems';
    }
};