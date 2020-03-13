const UserModel = require('../model/User');

class Settings {
    async setUserSystemSettings({ userId, params }) {
        return await this._setSettings(userId, params, 'system');
    }

    async setUserSettings({ userId, params }) {
        return await this._setSettings(userId, params, 'user');
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

        return await UserModel.findOne({ userId }, projection, { lean: true });
    }

    async _setSettings(userId, params, namespace) {
        const updates = {};
        let isEmpty = true;

        for (const [key, value] of Object.entries(params)) {
            updates[`${namespace}.${key}`] = value;
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
            {
                $set: updates,
            },
            {
                upsert: true,
            }
        );
    }
}

module.exports = Settings;
