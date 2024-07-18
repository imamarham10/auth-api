const nodemailer = require('nodemailer');
const { subscribe } = require('../route/testEmail');
require('dotenv').config();
const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.GMAIL_ID, 
    pass: process.env.GMAIL_PASSWORD,
  },
});

let emailQueue = [];
const BATCH_SIZE = 10;
const BATCH_INTERVAL = 60000;

const sendBatchEmails = async () => {
  if (emailQueue.length === 0) {
    return;
  }

  const emailsToSend = emailQueue.splice(0, BATCH_SIZE);
  const emailPromises = emailsToSend.map(({ to, subject, text }) => {
    const mailOptions = {
      from: process.env.GMAIL_ID,
      to,
      subject,
      text,
    };

    return transporter.sendMail(mailOptions);
  });

  try {
    await Promise.all(emailPromises);
    console.log('Batch emails sent');
  } catch (error) {
    console.error('Error sending batch emails:', error);
  }
};

setInterval(()=>{
  sendBatchEmails();
}, BATCH_INTERVAL);

const queueEmail = (to, subject, text) => {
  emailQueue.push({to, subject, text});

  if(emailQueue.length >= BATCH_SIZE){
    sendBatchEmails();
  }
}


module.exports = queueEmail;
