const firebase = require('firebase');

class FirebaseDB {

    constructor(firebaseConfig) {
        firebase.initializeApp(firebaseConfig);
        this.db = firebase.database();
        this.users = this.db.ref('/users');
    }

    /**
     * Get user by user id
     * @param userId
     * @returns {firebase.database.Reference}
     */
    getUserByUserId(userId) {
        return this.db.ref('/users/' + userId);
    }

    /**
     * Add new free user into storage
     * @param userConfig
     * @returns {Promise<void>}
     */
    async addUser(userConfig) {
        const user = this.users.push();
        await user.set({
            ...userConfig,
            locked: false
        });
    }

    /**
     * Get free user from list
     * @returns {Promise<firebase.database.DataSnapshot|null>}
     */
    async getFreeUser() {
        const userQuery = this.users
            .orderByChild('locked')
            .equalTo(false)
            .limitToFirst(1);
        const user = (await userQuery.get()).toJSON();
        if (user) {
            const userId = Object.keys(user)[0]
            const userRef = this.getUserByUserId(userId);
            await userRef.update({locked: true});
            return {
                id: userId,
                ...user[userId]
            }
        }
        return null
    }

    /**
     * Get certain user
     * @param userId
     * @returns {Promise<firebase.database.DataSnapshot>}
     */
    async getUser(userId) {
        return this.getUserByUserId(userId).get()
    }

    /**
     * Update user in storage mark it as free
     * @param userId
     * @returns {Promise<void>}
     */
    async freeUser(userId) {
        const userRef = this.getUserByUserId(userId);
        await userRef.update({locked: false});
    }

    /**
     * Delete user by userId
     * @param userId
     * @returns {Promise<void>}
     */
    async deleteUser(userId) {
        const userRef = this.getUserByUserId(userId);
        await userRef.remove();
    }

    /**
     * Delete all users
     * @returns {Promise<void>}
     */
    async deleteUsers() {
        await this.users.remove();
    }

}

module.exports = { FirebaseDB };
