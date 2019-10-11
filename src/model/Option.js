const core = require('cyberway-core-service');
const MongoDB = core.services.MongoDB;

module.exports = MongoDB.makeModel(
    'Option',
    {
        userId: {
            type: String,
            required: true,
        },
        profile: {
            type: String,
            required: true,
        },
        options: {
            type: Object,
            default: {},
        },
    },
    {
        index: [
            {
                fields: {
                    userId: 1,
                    profile: 1,
                },
                options: {
                    unique: true,
                },
            },
        ],
    }
);
