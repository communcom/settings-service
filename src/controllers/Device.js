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

    async getUserFcmTokens({ userId }) {
        const devices = await DeviceModel.find(
            {
                userId,
                fcmToken: { $ne: null },
                timeZoneOffset: { $ne: null },
            },
            {
                _id: false,
                fcmToken: true,
                timeZoneOffset: true,
            }
        );

        return {
            tokens: devices,
        };
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
