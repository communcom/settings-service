const DeviceModel = require('../model/Device');

class Device {
    async setDeviceInfo({ timeZoneOffset }, { userId }, clientInfo) {
        const deviceId = extractFullDeviceId(clientInfo);

        const updates = {
            userId,
        };

        if (typeof timeZoneOffset === 'number') {
            updates.timeZoneOffset = timeZoneOffset;
        }

        await DeviceModel.updateOne(
            {
                deviceId,
            },
            {
                $set: updates,
            },
            {
                upsert: true,
            }
        );
    }

    async setFcmToken({ fcmToken }, { userId }, clientInfo) {
        const deviceId = extractFullDeviceId(clientInfo);

        await DeviceModel.updateOne(
            {
                deviceId,
            },
            {
                $set: {
                    userId,
                    fcmToken,
                },
            },
            {
                upsert: true,
            }
        );
    }

    async cancelFcmToken({}, { userId }, clientInfo) {
        const deviceId = extractFullDeviceId(clientInfo);

        await DeviceModel.updateOne(
            {
                deviceId,
            },
            {
                $set: {
                    userId,
                    fcmToken: null,
                },
            }
        );
    }
}

function extractFullDeviceId({ platform, deviceId }) {
    if (!platform || !deviceId) {
        throw {
            code: 500,
            message: 'Invalid client info',
        };
    }

    return `${platform}:${deviceId}`;
}

module.exports = Device;
