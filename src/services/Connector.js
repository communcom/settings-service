const core = require('cyberway-core-service');
const { Connector: BasicConnector } = core.services;

const Device = require('../controllers/Device');
const Settings = require('../controllers/Settings');
const Notifications = require('../controllers/Notifications');

class Connector extends BasicConnector {
    constructor() {
        super();

        this._device = new Device();
        this._settings = new Settings();
        this._notifications = new Notifications();
    }

    async start() {
        await super.start({
            serverRoutes: {
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
                    handler: this._notifications.setNotificationsSettings,
                    scope: this._notifications,
                    inherits: ['disable'],
                    validation: {},
                },
                setPushSettings: {
                    handler: this._notifications.setPushSettings,
                    scope: this._notifications,
                    inherits: ['disable'],
                    validation: {},
                },
                getNotificationsSettings: {
                    handler: this._notifications.getNotificationsSettings,
                    scope: this._notifications,
                    validation: {},
                },
                getPushSettings: {
                    handler: this._notifications.getPushSettings,
                    scope: this._notifications,
                    validation: {},
                },
                getAllNotificationsSettings: {
                    handler: this._notifications.getAllNotificationsSettings,
                    scope: this._notifications,
                    inherits: ['userId'],
                    validation: {},
                },
                setUserSystemSettings: {
                    handler: this._settings.setUserSystemSettings,
                    scope: this._settings,
                    inherits: ['userId'],
                    validation: {
                        properties: {
                            params: {
                                type: 'object',
                            },
                            addToSet: {
                                type: 'object',
                            },
                        },
                    },
                },
                setUserSettings: {
                    handler: this._settings.setUserSettings,
                    scope: this._settings,
                    validation: {
                        properties: {
                            params: {
                                type: 'object',
                            },
                            addToSet: {
                                type: 'object',
                            },
                        },
                    },
                },
                getUserSettings: {
                    handler: this._settings.getUserSettings,
                    scope: this._settings,
                    validation: {
                        properties: {
                            userId: {
                                type: 'string',
                            },
                            apiSecret: {
                                type: 'string'
                            },
                            namespaces: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                },
                                default: ['system', 'user'],
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
                    disable: {
                        validation: {
                            properties: {
                                disable: {
                                    type: 'array',
                                    items: {
                                        type: 'string',
                                        enum: [
                                            'all',
                                            'mention',
                                            'reply',
                                            'subscribe',
                                            'upvote',
                                            'transfer',
                                            'reward',
                                        ],
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
