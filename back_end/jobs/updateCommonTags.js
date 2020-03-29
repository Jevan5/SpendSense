const Receipt = require('../models/receipt/receipt');
const ReceiptItem = require('../models/receiptItem/receiptItem');
const SystemItem = require('../models/systemItem/systemItem');
const CommonTag = require('../models/commonTag/commonTag');
const Job = require('./job');

module.exports = class UpdateCommonTags extends Job {
    /**
     * Clears all existing common tags, and re-calculates them by finding
     * the most commonly used tag for each name of a system item.
     * @returns {Promise} Resolves when the job has completed.
     */
    static job() {
        // Mapping from system item id to the amount of times it was used
        let systemItemIdCounts = new Map();

        // Mapping from a name to a mapping from the tags used for it
        // to the number of times the tag is used
        let tagCounts = new Map();

        let commonTags = [];

        return CommonTag.deleteMany().then(() => {
            return Receipt.find({ date: { $lt: new Date(), $gte: new Date(new Date().setDate(new Date().getDate() - 31)) }});
        }).then((receipts) => {
            let receiptIds = [];

            receipts.forEach((receipt) => {
                receiptIds.push(receipt._id);
            });

            return ReceiptItem.find({ _receiptId: { $in: receiptIds } });
        }).then((receiptItems) => {
            receiptItems.forEach((receiptItem) => {
                if (!systemItemIdCounts.has(receiptItem._systemItemId.toString())) {
                    systemItemIdCounts.set(receiptItem._systemItemId.toString(), 0);
                }

                systemItemIdCounts.set(receiptItem._systemItemId.toString(), systemItemIdCounts.get(receiptItem._systemItemId.toString()) + 1);
            });

            return SystemItem.find();
        }).then((systemItems) => {
            systemItems.forEach((systemItem) => {
                if (!systemItemIdCounts.has(systemItem._id.toString())) {
                    return;
                }

                if (!tagCounts.has(systemItem.name)) {
                    tagCounts.set(systemItem.name, new Map());
                }

                if (!tagCounts.get(systemItem.name).has(systemItem.tag)) {
                    tagCounts.get(systemItem.name).set(systemItem.tag, 0);
                }

                let count = tagCounts.get(systemItem.name).get(systemItem.tag);

                tagCounts.get(systemItem.name).set(systemItem.tag, count + 1);
            });

            tagCounts.forEach((tagCount, name) => {
                let maxCount = 0;
                let maxTag;

                tagCount.forEach((count, tag) => {
                    if (count > maxCount) {
                        maxCount = count;
                        maxTag = tag;
                    }
                });

                commonTags.push({
                    tag: maxTag,
                    name: name
                });
            });

            return CommonTag.insertMany(commonTags);
        });
    }

    static getName() {
        return 'UpdateCommonTags';
    }
}