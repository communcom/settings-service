const OptionModel = require('../model/Option');
const NotificationsSettings = require('../model/NotificationsSettings');

class Options {
    async get({ userId, profile }) {
        const model = await OptionModel.findOne(
            { userId, profile },
            { options: true },
            { lean: true }
        );

        if (!model || !model.options) {
            return {};
        }

        return model.options;
    }

    async set({ userId, profile, data }) {
        let model = await OptionModel.findOne({ userId, profile }, { options: true });

        if (!model) {
            model = new OptionModel({ userId, profile });
        }

        model.options = Object.assign({}, model.options, data);

        await model.save();
    }

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

module.exports = Options;
