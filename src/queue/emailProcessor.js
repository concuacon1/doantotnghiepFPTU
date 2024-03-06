const emailQueue = require('./sendEmailQueue');
const sendEmail = require('./emailWorker');

emailQueue.process('send-email', async (job) => {
  const { data } = job;
  await sendEmail(data);
});