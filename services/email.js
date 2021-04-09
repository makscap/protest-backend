const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
const config = require('../config/email.json')
require('dotenv').config()

class EmailService {
    #sender = sgMail
    #GenerateTemplate = Mailgen
    constructor(env) {
        switch (env) {
            case 'development' :
                this.link = config.dev
                break
                case 'production':
                    this.link = config.prod
                    break
                    default:
                        this.link = config.dev

                        break
        }
    }

    #createTemplate(verifyToken, name = 'Guest') {
        const mailGenerator = new this.#GenerateTemplate({
            theme: 'cerberus',
            product: {
                name: 'System contacts',
                link: this.link
            },
        });
        const template = {
            body: {
                name,
                intro: 'This is your contacts book',
                action: {
                    instructions: 'To complete registration, click here',
                    button: {
                        color: '#22BC66', // Optional action button color
                        text: 'Confirm your account',
                        link: `${this.link}/api/users/verify/${verifyToken}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
        return mailGenerator.generate(template)
    }

    async sendEmail(verifyToken, email) {
        const emailBody = this.#createTemplate(verifyToken)
        this.#sender.setApiKey(process.env.SENDGRID_API_KEY) 
        const msg = {
            to: email,
            from: 'kus_queen@icloud.com', // Use the email address or domain you verified above
            subject: 'Confirmation of registration',
            html: emailBody,
};
// ES6
  await this.#sender.send(msg) 
    }
}

module.exports = EmailService