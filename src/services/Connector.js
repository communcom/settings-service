const core = require('cyberway-core-service');
const { Connector: BasicConnector } = core.services;

const Options = require('../controllers/Options');
const Device = require('../controllers/Device');

class Connector extends BasicConnector {
    constructor() {
        super();

        this._options = new Options();
        this._device = new Device();
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
                setDeviceInfo: {
                    handler: this._device.setDeviceInfo,
                    scope: this._device,
                    validation: {
                        properties: {
                            timeZoneOffset: {
                                type: 'number',
                            },
                        },
                    },
                },
                setFcmToken: {
                    handler: this._device.setFcmToken,
                    scope: this._device,
                    validation: {
                        required: ['fcmToken'],
                        properties: {
                            fcmToken: {
                                type: 'string',
                            },
                        },
                    },
                },
                cancelFcmToken: {
                    handler: this._device.cancelFcmToken,
                    scope: this._device,
                    validation: {},
                },
                getUserFcmTokens: {
                    handler: this._device.getUserFcmTokens,
                    scope: this._device,
                    inherits: ['userId'],
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
