const sinon = require('sinon');
const { FirebaseDB } = require('../src/db');
const firebase = require('firebase');
const { expect } = require('chai');

test('getFreeUser - user exists', async () => {
    const toJSONStub = sinon.stub().returns({
        'superid': {
            user: 'id1',
            locked: false
        }
    });

    const getStub = sinon.stub().returns({toJSON: toJSONStub});
    const limitToFirstStub = sinon.stub().withArgs(1).returns({get: getStub});
    const equalToStub = sinon.stub().withArgs(false).returns({limitToFirst: limitToFirstStub});
    const orderByChildStub = sinon.stub().withArgs('locked').returns({equalTo: equalToStub});
    const updateStub = sinon.stub();
    const refStub = sinon.stub().returns({
        orderByChild: orderByChildStub,
        update: updateStub
    });
    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getFreeUser();
    expect(user).to.eqls({'id': 'superid', 'locked': false, 'user': 'id1'});
});

test('getFreeUser - user doesnt exists', async () => {
    const toJSONStub = sinon.stub().callsFake(() => null);

    const getStub = sinon.stub().returns({toJSON: toJSONStub});
    const limitToFirstStub = sinon.stub().withArgs(1).returns({get: getStub});
    const equalToStub = sinon.stub().withArgs(false).returns({limitToFirst: limitToFirstStub});
    const orderByChildStub = sinon.stub().withArgs('locked').returns({equalTo: equalToStub});
    const updateStub = sinon.stub();
    const refStub = sinon.stub().returns({
        orderByChild: orderByChildStub,
        update: updateStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getFreeUser();
    expect(user).to.eqls(null);
});

test('freeUser', async () => {
    const updateStub = sinon.stub();
    const refStub = sinon.stub().returns({
        update: updateStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    await db.freeUser('42');
    expect(refStub.calledWith('/users/42')).to.equal(true);
    expect(updateStub.calledWith({locked: false})).to.equal(true);
});

test('get certain user', async () => {
    const getStub = sinon.stub().returns({
        user: 'id1',
        locked: false
    });
    const refStub = sinon.stub().returns({
        get: getStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    const user = await db.getUser('42');
    expect(refStub.calledWith('/users/42')).to.equal(true);
    expect(getStub.called).to.equal(true);
    expect(user).to.eqls({'user': 'id1', 'locked': false});
});

test('add user', async () => {
    const setStub = sinon.stub();
    const pushStub = sinon.stub().returns({
        set: setStub
    });
    const refStub = sinon.stub().returns({
        push: pushStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    await db.addUser({
        username: 'user',
        password: 'password'
    });
    expect(refStub.calledWith('/users')).to.equal(true);
    expect(pushStub.called).to.equal(true);
    expect(setStub.calledWith({
        username: 'user',
        password: 'password',
        locked: false
    })).to.equal(true);
});

test('delete user', async () => {
    const removeStub = sinon.stub();
    const refStub = sinon.stub().returns({
        remove: removeStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    await db.deleteUser('42');
    expect(refStub.calledWith('/users/42')).to.equal(true);
    expect(removeStub.called).to.equal(true);
});

test('delete users', async () => {
    const removeStub = sinon.stub();
    const refStub = sinon.stub().returns({
        remove: removeStub
    });

    sinon.stub(firebase, 'initializeApp');
    sinon.stub(firebase, 'database').returns({ref: refStub});
    const db = new FirebaseDB();

    await db.deleteUsers();
    expect(refStub.calledWith('/users')).to.equal(true);
    expect(removeStub.called).to.equal(true);
});

afterEach(async () => {
    sinon.restore();
});
