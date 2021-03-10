const production = {
    baseApiURL: process.env.API_URL_PRD,
    mongoUri: process.env.PROD_ATLAS_URI,
    activateEmailSender: process.env.ACTIVATE_USER_SENDER_EMAIL,
    activatePwdSender: process.env.ACTIVATE_USER_SENDER_PWD,
    activateEmailHost: process.env.ACTIVATE_USER_SENDER_HOST,
    activateEmailPort: process.env.ACTIVATE_USER_SENDER_PORT,
}

const development = {
    baseApiURL: process.env.API_URL_DEV,
    mongoUri: process.env.DEV_ATLAS_URI,
    activateEmailSender: process.env.ACTIVATE_USER_SENDER_EMAIL,
    activatePwdSender: process.env.ACTIVATE_USER_SENDER_PWD,
    activateEmailHost: process.env.ACTIVATE_USER_SENDER_HOST,
    activateEmailPort: process.env.ACTIVATE_USER_SENDER_PORT,
}

module.exports = process.env.NODE_ENV === 'production' ? production : development