const LocationItem  = require('../models/locationItem/locationItem');
const Receipt       = require('../models/receipt/receipt');
const ReceiptItem   = require('../models/receiptItem/receiptItem');
const SystemItem    = require('../models/systemItem/systemItem');
const logger        = require('../tools/logger');

module.exports = class UpdateLocationItems {
    /**
     * Kicks off the job of updating location items over
     * intervals of time. Updates immediately.
     * @param {number} milliseconds Number of milliseconds to wait between
     * each update.
     * @returns {Promise} Never resolves, as additional jobs continue to chain.
     */
    static async startJob(milliseconds) {
        console.log('updating location items');
        await this.updateLocationItems();
        console.log('updated location items');

        await new Promise((resolve, reject) => {
            setTimeout(() => { resolve() }, milliseconds);
        });

        console.log('waited ' + milliseconds + ' ms');

        return this.startJob(milliseconds);
    }
    /**
     * Clears all existing location items, and re-calculates them
     * by finding the average price of a system item at each location.
     * @returns {Promise} Resolves when the job has completed.
     */
    static updateLocationItems() {
        // Mapping from receipt _ids to receipts
        var receipts = {};
        // Mapping from receipt item _ids to receipt items
        var receiptItems = {};
        // Mapping from system item _ids to system items
        var systemItems = {};
        // Mapping from location ids to mapping from name to mapping from tag to [<average price>, <count>]
        var locationItems = {};

        return LocationItem.deleteMany().then(() => {  // Delete all location items
            return Receipt.find({ date: { $lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 14)) }, _locationId: { $ne: null } });
        }).then((r) => { // All receipts in the last two weeks which belong to a location
            var receiptIds = [];

            r.forEach((receipt) => {
                receipts[receipt._id] = receipt;
                locationItems[receipt._locationId] = {};
                receiptIds.push(receipt._id);
            });

            return ReceiptItem.find({ _receiptId: { $in: receiptIds } });
        }).then((r) => {    // All receipt items which belong to those receipts
            var systemItemIds = [];

            r.forEach((receiptItem) => {
                receiptItems[receiptItem._id] = receiptItem;
                systemItemIds.push(receiptItem._systemItemId);
            });

            return SystemItem.find({ _id: { $in: systemItemIds } });
        }).then((s) => {    // All system items for those receipt items
            s.forEach((systemItem) => {
                systemItems[systemItem._id] = systemItem;
            });

            for (var key in receiptItems) {
                if (receiptItems.hasOwnProperty(key)) {
                    var receiptItem = receiptItems[key];
                    var receipt = receipts[receiptItem._receiptId];
                    var systemItem = systemItems[receiptItem._systemItemId];

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
                    var priceAndCount = locationItems[receipt._locationId][systemItem.name][systemItem.tag];
                    var price = priceAndCount[0];
                    var count = priceAndCount[1];

                    priceAndCount[0] = (price * count + receiptItem.price) / (count + 1);
                    priceAndCount[1] = count + 1;
                }
            }

            var locationItemDocs = [];

            for (var locationId in locationItems) {
                if (locationItems.hasOwnProperty(locationId)) {
                    for (var name in locationItems[locationId]) {
                        if (locationItems[locationId].hasOwnProperty(name)) {
                            for (var tag in locationItems[locationId][name]) {
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
};