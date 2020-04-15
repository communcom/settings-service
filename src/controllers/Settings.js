const UserModel = require('../model/User');
const { GLS_API_SECRET } = require('../data/env');

class Settings {
    async setUserSystemSettings({ userId, params, addToSet }) {
        return await this._setSettings(userId, params, addToSet, 'system');
    }

    async setUserSettings({ params, addToSet }, { userId }) {
        return await this._setSettings(userId, params, addToSet, 'user');
    }

    async getUserSettings({ namespaces, userId: forceUserId, apiSecret }, { userId: authUserId }) {
        let userId = authUserId;
        if (apiSecret) {
            if (apiSecret !== GLS_API_SECRET) {
                throw {
                    code: 1003,
                    message: 'Secret is not valid',
                };
            }
            userId = forceUserId;
        }

        if (!userId) {
            throw {
                code: 1004,
                message: 'No userId provided',
            };
        }

        const projection = {
            _id: false,
        };
        let someSelected = false;

        for (const namespace of namespaces) {
            const path = namespace.split('.');

            if (path[0] !== 'system' && path[0] !== 'user') {
                throw {
                    code: 400,
                    message: 'Invalid namespaces param',
                };
            }

            projection[namespace] = true;
            someSelected = true;
        }

        if (!someSelected) {
            throw {
                code: 400,
                message: 'Invalid namespaces param',
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

        if (params) {
            for (const [key, value] of Object.entries(params)) {
                if (!updates.$set) {
                    updates.$set = {};
                }

                const path = `${namespace}.${key}`;
                updates.$set[path] = value;
                isEmpty = false;
            }
        }

        if (addToSet) {
            for (const [key, value] of Object.entries(addToSet)) {
                if (!updates.$addToSet) {
                    updates.$addToSet = {};
                }

                const path = `${namespace}.${key}`;

                if (Array.isArray(value)) {
                    updates.$addToSet[path] = {
                        $each: value,
                    };
                } else {
                    updates.$addToSet[path] = value;
                }

                isEmpty = false;
            }
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
