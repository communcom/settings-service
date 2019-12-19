const OptionModel = require('../model/Option');

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
}

module.exports = Options;
