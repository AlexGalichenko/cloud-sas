const sinon = require('sinon');
const { FirebaseDB } = require('../src/db');
const firebase = require('firebase');
const { expect } = require('chai');

test('getFreeUser - user exists', async () => {
    const toJSONStub = sinon.stub().callsFake(() => ({
        'superid': {
            user: 'id1',
            locked: false
        }
    }));

    const getStub = sinon.stub().returns({toJSON: toJSONStub});
    const limitToFirstStub = sinon.stub().withArgs(1).returns({get: getStub});
    const equalToStub = sinon.stub().withArgs(false).returns({limitToFirst: limitToFirstStub});
    const orderByChildStub = sinon.stub().withArgs('locked').returns({equalTo: equalToStub});
    const updateStub = sinon.stub();
    const refStub = sinon.stub().withArgs('waterLogs').returns({
        orderByChild: orderByChildStub,
        update: updateStub
    });
    const initStub = sinon.stub(firebase, 'initializeApp');
    const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getFreeUser();
    expect(user).to.eqls({"id": "superid", "locked": false, "user": "id1"});
});

test('getFreeUser - user doesnt exists', async () => {
    const toJSONStub = sinon.stub().callsFake(() => null);

    const getStub = sinon.stub().returns({toJSON: toJSONStub});
    const limitToFirstStub = sinon.stub().withArgs(1).returns({get: getStub});
    const equalToStub = sinon.stub().withArgs(false).returns({limitToFirst: limitToFirstStub});
    const orderByChildStub = sinon.stub().withArgs('locked').returns({equalTo: equalToStub});
    const updateStub = sinon.stub();
    const refStub = sinon.stub().withArgs('waterLogs').returns({
        orderByChild: orderByChildStub,
        update: updateStub
    });

    const initStub = sinon.stub(firebase, 'initializeApp');
    const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getFreeUser();
    expect(user).to.eqls(null);
});

test('freeUser', async () => {
    const updateStub = sinon.stub();
    const refStub = sinon.stub().withArgs('waterLogs').returns({
        update: updateStub
    });

    const initStub = sinon.stub(firebase, 'initializeApp');
    const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.freeUser('42');
    expect(refStub.calledWith('/users/42')).to.equal(true);
    expect(updateStub.calledWith({locked: false})).to.equal(true);
});

test('get certain user', async () => {
    const getStub = sinon.stub();
    const refStub = sinon.stub().withArgs('waterLogs').returns({
        get: getStub
    });

    const initStub = sinon.stub(firebase, 'initializeApp');
    const databaseStub = sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getUser('42');
    expect(refStub.calledWith('/users/42')).to.equal(true);
    expect(getStub.called).to.equal(true);
});


afterEach(async () => {
    sinon.restore();
});
