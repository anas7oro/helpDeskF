const crypto = require('crypto');
const User = require('../models/userModel');
const {logger} = require('../utils/logger');
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Function to encrypt data
const encryptData = (data) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);

    let encrypted = cipher.update(data, 'utf-8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted,
        tag: tag.toString('hex'),
    };
};

// Function to decrypt data
const decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        Buffer.from(ENCRYPTION_KEY, 'hex'),
        Buffer.from(encryptedData.iv, 'hex')
    );

    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encryptedData, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');

    return decrypted;
};

// Function to encrypt sensitive data for a specific user
const encryptUserSensitiveData = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            logger.error('No user found with this ID');
            return;
        }

        if (user.name || user.email || user.address || user.phoneNumber) {
            const sensitiveData = {
                name: user.name,
               // email: user.email,
                address: user.address,
                phoneNumber: user.phoneNumber,
            };

            const encryptedData = encryptData(JSON.stringify(sensitiveData));

            // Save the encrypted data back to the database
            await User.updateOne({ _id: user._id }, { sensitiveData: encryptedData });
        }

        logger.info('Sensitive data encrypted for user with ID:', userId);
    } catch (error) {
        logger.error('Error encrypting sensitive data:', error.message);
    }
};

// Function to decrypt sensitive data for a specific user
const decryptUSerSensitiveDataForUser = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user.sensitiveData) {
            logger.info('No sensitive data found for the user.');
            return;
        }

        const decryptedData = decryptData(user.sensitiveData);

        // Use the decrypted data as needed
        logger.info(JSON.parse(decryptedData));
    } catch (error) {
        logger.error('Error decrypting sensitive data:', error.message);
    }
};