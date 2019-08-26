const mail = require('@sendgrid/mail');
const pug = require('pug');
const path = require('path');
const config = require('config');

mail.setApiKey(config.SENDGRID_KEY);

/**
 * Email poxy
 */
const emailService = {

  send: async (to, subject, template, data, from = config.DEFAULT_INFO_EMAIL) => {

    const jsonPath = path.join(__dirname, '../views/', template);
    const html = await pug.renderFile(jsonPath, data);
    const msg = {
      to,
      from,
      subject,
      html,
    };
    return new Promise((resolve, reject) => {
      mail.send(msg, (err) => {
        if (err) {
          resolve({
            status: false,
            msg: err.message,
          });
        } else {
          resolve({
            status: true,
            msg: 'mail sent',
          });
        }
      });
    });
  }
}

module.exports = emailService;
