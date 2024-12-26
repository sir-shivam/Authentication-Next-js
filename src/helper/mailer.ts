const nodemailer = require('nodemailer');
const { google } = require('googleapis');
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const CLIENT_ID = process.env.CLIENT_ID ;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN ;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendEmail({
    email,
    emailType,
    userId,
  }: {
    email: string;
    emailType: string;
    userId: string;
  }) {
  try {
    const accessToken = await oauth2Client.getAccessToken();

      // Create hash token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Update user tokens in the database
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'sirshivam25@@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
            from: "sirshivam25@gmail.com",
            to: "anamikagupta.1201@gmail.com", // Use the email parameter
            subject:
              emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
            html: `
                      <p>
                          Click <a href="${
                            process.env.DOMAIN
                          }/verifyemail?token=${hashedToken}">here</a> to ${
              emailType === "VERIFY" ? "verify your email" : "reset your password"
            }.<br>
                          Or copy and paste the link below into your browser:<br>
                          ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
                      </p>
                  `,
          };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



// import nodemailer from "nodemailer";
// import User from "@/models/userModel";
// import bcryptjs from "bcryptjs";
// import dotenv from "dotenv";
// dotenv.config();

// // const nodemailer = require('nodemailer');
// const { google } = require('googleapis');

// const CLIENT_ID = 'YOUR_CLIENT_ID';
// const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';
// const REFRESH_TOKEN = 'YOUR_REFRESH_TOKEN';
// const REDIRECT_URI = 'https://developers.google.com/oauthplayground';

// const oauth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );

// export const sendEmail = async ({
//   email,
//   emailType,
//   userId,
// }: {
//   email: string;
//   emailType: string;
//   userId: string;
// }) => {
//   console.log(process.env.MAIL_USER, process.env.MAIL_PASS);
//   try {
//     // Create hash token
//     const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//     // Update user tokens in the database
//     if (emailType === "VERIFY") {
//       await User.findByIdAndUpdate(userId, {
//         verifyToken: hashedToken,
//         verifyTokenExpiry: Date.now() + 3600000, // 1 hour
//       });
//     } else if (emailType === "RESET") {
//       await User.findByIdAndUpdate(userId, {
//         forgotPasswordToken: hashedToken,
//         forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
//       });
//     }

//     // Create transport for nodemailer
//     // Looking to send emails in production? Check out our Email API/SMTP product!
//     const transport = nodemailer.createTransport({
//       service: "gmail", // Use Gmail's built-in service
//       auth: {
//         user: "shivamgupta4155@gmail.com",
//         pass: "NodeShiva@mail",
//       },
//     });

//     transport.verify((error, success) => {
//       if (error) {
//         console.error("SMTP connection failed:", error);
//       } else {
//         console.log("SMTP connection successful!");
//       }
//     });

//     // Construct the email
//     const mailOptions = {
//       from: "billz@gmail.com",
//       to: "sirshivam25@gmail.com", // Use the email parameter
//       subject:
//         emailType === "VERIFY" ? "Verify your Email" : "Reset your Password",
//       html: `
//                 <p>
//                     Click <a href="${
//                       process.env.DOMAIN
//                     }/verifyemail?token=${hashedToken}">here</a> to ${
//         emailType === "VERIFY" ? "verify your email" : "reset your password"
//       }.<br>
//                     Or copy and paste the link below into your browser:<br>
//                     ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
//                 </p>
//             `,
//     };

//     // Send the email
//     const mailResponse = await transport.sendMail(mailOptions);

//     return mailResponse;
//   } catch (error: any) {
//     console.error("Error sending email:", error.message);
//     throw new Error("Failed to send email. Please try again later.");
//   }
// };
