const core = require('cyberway-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'Device',
    {
        deviceId: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        timeZoneOffset: {
            type: Number,
            default: null,
        },
        fcmToken: {
            type: String,
            default: null,
        },
    },
    {
        index: [
            {
                fields: {
                    deviceId: 1,
                },
                options: {
                    unique: true,
                },
            },
        ],
    }
);
