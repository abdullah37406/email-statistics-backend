const nodemailer = require('nodemailer');

// Array of email accounts with their credentials
const emailAccounts = [
  { user: 'caronjoel023@gmail.com', pass: 'ecmh pvik lwha flbi' },
  { user: 'dosogne.t2017@gmail.com', pass: 'azzk izof ptte uuix' },
  { user: 'shiraz.032031@gmail.com', pass: 'dehi ugre sxau lntb' },
  { user: 'ahmed012855556@gmail.com', pass: 'hozm afeo ydpe clki' },
  { user: 'mutuellefrancaise722@gmail.com', pass: 'famo pwin errd nzjw' }
];

let currentAccountIndex = 0;

// List of recipients
let recipients = [
  'adnanejobs01@gmail.com',
  'ali.hassine0881@gmail.com',
  'caronjoel023@gmail.com',
  'dosogne.t2017@gmail.com',
  'shiraz.032031@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adndigitalmarketing31@gmail.com',
  'generatereviews@gmail.com',
  'ahmed012855556@gmail.com',
  'mutuellefrancaise722@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adnaneabdellaoui01@gmail.com',
  'adnanejobs01@gmail.com',
  'adnanejobs01@gmail.com',
  'adnanejobs01@gmail.com',
  'adnanejobs01@gmail.com',
  'adnanejobs01@gmail.com',
  'generatereviews@gmail.com',
  'generatereviews@gmail.com',
  'generatereviews@gmail.com',
  'generatereviews@gmail.com',
  'generatereviews@gmail.com',
  'adndigitalmarketing31@gmail.com',
  'adndigitalmarketing31@gmail.com',
  'adndigitalmarketing31@gmail.com',
  'adndigitalmarketing31@gmail.com',
  'adndigitalmarketing31@gmail.com',
];

// Function to send email
function sendEmail() {
  if (recipients.length === 0) {
    console.log('All recipients have received emails. Stopping the server.');
    clearInterval(emailInterval);
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailAccounts[currentAccountIndex].user,
      pass: emailAccounts[currentAccountIndex].pass
    }
  });

  let emailCount = 0;
  
  const sendNextEmail = () => {
    if (emailCount >= 5 || recipients.length === 0) {
      // Move to the next account and reset the email count
      currentAccountIndex = (currentAccountIndex + 1) % emailAccounts.length;
      emailCount = 0;

      if (recipients.length === 0) {
        console.log('All recipients have received emails. Stopping the server.');
        clearInterval(emailInterval);
        return;
      }
      return;
    }

    const currentRecipient = recipients.shift(); // Get and remove the first recipient from the list
    if (!currentRecipient) return; // If there are no more recipients, stop sending emails

    const mailOptions = {
      from: emailAccounts[currentAccountIndex].user, // Sender address
      to: currentRecipient, // Current recipient
      subject: 'Name Subject', // Subject line
      text: 'Tamplate .' // Plain text body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error occurred when sending to ${currentRecipient}:`, error);
      } else {
        console.log(`Email sent successfully to ${currentRecipient} from ${emailAccounts[currentAccountIndex].user}: ${info.response}`);
        emailCount++;
      }
      sendNextEmail(); // Send the next email after the current one completes
    });
  };

  sendNextEmail(); // Start sending emails
}

// Loop to continuously send emails
const emailInterval = setInterval(sendEmail, 10000); // Adjust the interval as needed (e.g., every 10 seconds)
