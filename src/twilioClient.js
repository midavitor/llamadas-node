const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const client = twilio(accountSid, authToken);

class TwilioClient {
    constructor() {
        this.client = client;
    }

    async makeCall(to, from) {
        try {
            const call = await this.client.calls.create({
                to: to,
                from: twilioNumber,
                url: 'http://demo.twilio.com/docs/voice.xml' // Example URL for Twilio to fetch instructions
            });
            return call.sid;
        } catch (error) {
            throw new Error(`Failed to make call: ${error.message}`);
        }
    }

    async getCallStatus(callSid) {
        try {
            const call = await this.client.calls(callSid).fetch();
            return call.status;
        } catch (error) {
            throw new Error(`Failed to get call status: ${error.message}`);
        }
    }
}

module.exports = TwilioClient;