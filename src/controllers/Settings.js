const UserModel = require('../model/User');

class Settings {
    async setUserSystemSettings({ userId, params, addToSet }) {
        return await this._setSettings(userId, params, addToSet, 'system');
    }

    async setUserSettings({ userId, params, addToSet }) {
        return await this._setSettings(userId, params, addToSet, 'user');
    }

    async getUserSettings({ namespaces }, { userId }) {
        const projection = {
            _id: false,
        };
        let someSelected = false;

        for (const namespace of projection) {
            const path = namespace.split('.');

            if (path[0] !== 'system' && path[0] !== 'user') {
                throw {
                    code: 400,
                    message: 'invalid namespaces param',
                };
            }

            projection[namespace] = true;
            someSelected = true;
        }

        if (!someSelected) {
            throw {
                code: 400,
                message: 'invalid namespaces param',
            };
        }

        const user = await UserModel.findOne({ userId }, projection, { lean: true });

        if (!user) {
            const emptyValue = {};

            if (namespaces.includes('user')) {
                emptyValue.user = {};
            }

            if (namespaces.includes('system')) {
                emptyValue.system = {};
            }

            return emptyValue;
        }

        return user;
    }

    async _setSettings(userId, params, addToSet, namespace) {
        const updates = {};
        let isEmpty = true;

        for (const [key, value] of Object.entries(params)) {
            if (!updates.$set) {
                updates.$set = {};
            }

            updates.$set[`${namespace}.${key}`] = value;
            isEmpty = false;
        }

        for (const [key, value] of Object.entries(addToSet)) {
            if (!updates.$addToSet) {
                updates.$addToSet = {};
            }

            if (Array.isArray(value)) {
                updates.$addToSet[key] = {
                    $each: value,
                };
            } else {
                updates.$addToSet[key] = value;
            }

            isEmpty = false;
        }

        if (isEmpty) {
            throw {
                code: 500,
                message: 'No update params',
            };
        }

        await UserModel.updateOne(
            {
                userId,
            },
            updates,
            {
                upsert: true,
            }
        );
    }
}

module.exports = Settings;
