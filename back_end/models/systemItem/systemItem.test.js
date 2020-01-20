const SystemItem = require('../systemItem/systemItem');

describe("Saving", () => {
    beforeEach((done) => {
        SystemItem.deleteMany().then(() => {
            done();
        }).catch((err) => {
            done(err);
        });
    });
    
    it("should reject without tag", (done) => {
        new SystemItem({
            name: 'banana'
        }).save().then(() => {
            done('Saved without tag');
        }).catch((err) => {
            done();
        });
    });

    it("should reject without name", (done) => {
        new SystemItem({
            tag: 'food'
        }).save().then(() => {
            done('Saved without name');
        }).catch((err) => {
            done();
        });
    });

    it("should resolve with saved systemItem", (done) => {
        new SystemItem({
            tag: 'food',
            name: 'banana'
        }).save().then((s) => {
            s.should.have.property('_id');
            s.should.have.property('__v');
            s.should.have.property('tag', 'food');
            s.should.have.property('name', 'banana');

            done();
        }).catch((err) => {
            done(err);
        });
    });

    it("should reject with non-unique (tag, name) pair", (done) => {
        new SystemItem({
            tag: 'food',
            name: 'banana'
        }).save().then(() => {
            new SystemItem({
                tag: 'food',
                name: 'banana'
            }).save().then(() => {
                done('Saved with non-unique (tag, name) pair');
            }).catch((err) => {
                done();
            });
        }).catch((err) => {
            done(err);
        });
    });

    it("should omit invalid fields", (done) => {
        new SystemItem({
            tag: 'food',
            name: 'banana',
            invalid: 'something'
        }).save().then((s) => {
            s.should.not.have.property('invalid');

            done();
        }).catch((err) => {
            done(err);
        });
    });
});