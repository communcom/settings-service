const NotificationsSettings = require('../model/NotificationsSettings');

class Notifications {
    async setNotificationsSettings({ disable }, { userId }) {
        await NotificationsSettings.updateOne(
            { userId },
            { $set: { webDisabled: disable } },
            { upsert: true }
        );
    }

    async setPushSettings({ disable }, { userId }) {
        await NotificationsSettings.updateOne(
            { userId },
            { $set: { pushDisabled: disable } },
            { upsert: true }
        );
    }

    async getNotificationsSettings({}, { userId }) {
        const settings = await NotificationsSettings.findOne(
            { userId },
            { _id: false, webDisabled: true },
            { lean: true }
        );

        return {
            disabled: settings ? settings.webDisabled : [],
        };
    }

    async getPushSettings({}, { userId }) {
        const settings = await NotificationsSettings.findOne(
            { userId },
            { _id: false, pushDisabled: true },
            { lean: true }
        );

        return {
            disabled: settings ? settings.pushDisabled : [],
        };
    }

    async getAllNotificationsSettings({ userId }) {
        const settings = await NotificationsSettings.findOne(
            { userId },
            { _id: false, webDisabled: true, pushDisabled: true },
            { lean: true }
        );

        if (!settings) {
            return {
                webDisabled: [],
                pushDisabled: [],
            };
        }

        return settings;
    }
}

module.exports = Notifications;
