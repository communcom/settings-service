const core = require('cyberway-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'NotificationsSettings',
    {
        userId: {
            type: String,
            required: true,
        },
        webDisabled: {
            type: [String],
            default: [],
        },
        pushDisabled: {
            type: [String],
            default: [],
        },
    },
    {
        index: [
            {
                fields: {
                    userId: 1,
                },
                options: {
                    unique: true,
                },
            },
        ],
    }
);
