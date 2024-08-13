const nodemailer = require("nodemailer");
require('dotenv').config();

exports.sendMail = function(email,Otp){
    
    // console.log(email);
    // console.log(Otp);

    const EMAIL = process.env.EMAIL;
    const PASSWORD = process.env.PASSWORD;

    //connect with smtp 
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL,
            pass: PASSWORD
        }
    });

    const details ={
          from: '', // sender address
          to: email, // list of receivers
          subject: "OTP Verification", // Subject line
          html: `<p>Hello,</p>
                 <p>Thank you for using our service. Your OTP verification code is <b>${Otp}</b>.</p>
                 <p>Please enter this OTP to proceed. If you did not request this OTP, please ignore this email.</p>
                 <p>Best Regards,</p>`, // HTML body
        }
    
        // send mail with defined transport object
         transporter.sendMail(details).then((res)=>{
        console.log("Message sent successfully with id:%s",res.messageId);
            
        }).catch((err)=>{
            console.log("Error Found",err)
           
        })
        return true

}

// module.exports = sendMail;