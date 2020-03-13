const core = require('cyberway-core-service');
const { MongoDB } = core.services;

module.exports = MongoDB.makeModel(
    'User',
    {
        userId: {
            type: String,
            required: true,
        },
        system: {
            type: Object,
            default: {},
        },
        user: {
            type: Object,
            default: {},
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
