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
                resetFcmToken: {
                    handler: this._device.resetFcmToken,
                    scope: this._device,
                    validation: {},
                },
                getUserFcmTokens: {
                    handler: this._device.getUserFcmTokens,
                    scope: this._device,
                    inherits: ['userId'],
                    validation: {},
                },
                setNotificationsSettings: {
                    handler: this._options.setNotificationsSettings,
                    scope: this._options,
                    inherits: ['disable'],
                    validation: {},
                },
                setPushSettings: {
                    handler: this._options.setPushSettings,
                    scope: this._options,
                    inherits: ['disable'],
                    validation: {},
                },
                getNotificationsSettings: {
                    handler: this._options.getNotificationsSettings,
                    scope: this._options,
                    validation: {},
                },
                getPushSettings: {
                    handler: this._options.getPushSettings,
                    scope: this._options,
                    validation: {},
                },
                getAllNotificationsSettings: {
                    handler: this._options.getAllNotificationsSettings,
                    scope: this._options,
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
                    disable: {
                        validation: {
                            properties: {
                                disable: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        enum: ['all', 'mention', 'reply', 'subscribe', 'upvote'],
                                    },
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
