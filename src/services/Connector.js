const core = require('cyberway-core-service');
const { Connector: BasicConnector } = core.services;

const Options = require('../controllers/Options');

class Connector extends BasicConnector {
    constructor() {
        super();

        this._options = new Options();
    }

    async start() {
        await super.start({
            serverRoutes: {
                get: {
                    handler: this._options.get,
                    scope: this._options,
                    inherits: ['userId', 'profile'],
                    validation: {},
                },
                set: {
                    handler: this._options.set,
                    scope: this._options,
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
                },
            },
        });
    }

    async stop() {
        await this.stopNested();
        await super.stop();
    }
}

module.exports = Connector;
