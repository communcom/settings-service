const core = require('cyberway-core-service');
const BasicConnector = core.services.Connector;
const Option = require('../model/Option');
const Favorite = require('../model/Favorite');

class Connector extends BasicConnector {
    async start() {
        await super.start({
            serverRoutes: {
                get: {
                    handler: this._get,
                    scope: this,
                    inherits: ['userId', 'profile'],
                    validation: {},
                },
                set: {
                    handler: this._set,
                    scope: this,
                    inherits: ['userId', 'profile'],
                    validation: {
                        required: ['data'],
                        properties: {
                            data: {
                                type: 'object',
                            },
                        },
                    },
                },
                getFavorites: {
                    handler: this._getFavorites,
                    scope: this,
                    inherits: ['userId'],
                    validation: {},
                },
                addFavorite: {
                    handler: this._addFavorite,
                    scope: this,
                    inherits: ['userId', 'permlink'],
                    validation: {},
                },
                removeFavorite: {
                    handler: this._removeFavorite,
                    scope: this,
                    inherits: ['userId', 'permlink'],
                    validation: {},
                },
            },
            serverDefaults: {
                parents: {
                    userId: {
                        validation: {
                            required: ['userId'],
                            properties: {
                                userId: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                    profile: {
                        validation: {
                            required: ['profile'],
                            properties: {
                                profile: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                    permlink: {
                        validation: {
                            required: ['permlink'],
                            properties: {
                                permlink: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        });

        this.addNested(this._connector);
    }

    async stop() {
        await this.stopNested();
    }

    async _get({ userId, profile }) {
        const model = await Option.findOne({ userId, profile }, { options: true }, { lean: true });

        if (!model || !model.options) {
            return {};
        }

        return model.options;
    }

    async _set({ userId, profile, data }) {
        let model = await Option.findOne({ userId, profile }, { options: true });

        if (!model) {
            model = new Option({ userId, profile });
        }

        model.options = Object.assign({}, model.options, data);

        await model.save();
    }

    async _getFavorites({ userId }) {
        const model = await Favorite.findOne({ userId }, { list: true }, { lean: true });

        let list = [];

        if (model && !model.list) {
            list = model.list;
        }

        return {
            list,
        };
    }

    async _addFavorite({ userId, permlink }) {
        const model = await this._findOrCreateFavorites(userId);
        model.list.push(permlink);
        await model.save();
    }

    async _removeFavorite({ userId, permlink }) {
        const model = await this._findOrCreateFavorites(userId);
        model.list = model.list.filter(link => link !== permlink);
        await model.save();
    }

    async _findOrCreateFavorites(userId) {
        const model = await Favorite.findOne({ userId });

        if (!model) {
            return new Favorite({ userId });
        }

        return model;
    }
}

module.exports = Connector;
