import { transporter } from '../../config/email.config'
import {Verification_Email_Template,Welcome_Email_Template} from '../../contollers/email/EmailTemplate'
import nodemailer from 'nodemailer'

export const sendVerificationEamil=async(email:string,verificationCode:string)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"nagarAarogya" <sybooks1000@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: Verification_Email_Template.replace("{verificationCode}",verificationCode)
        })
        // console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
export const sendWelcomeEmail=async(email:string,name:string)=>{
    try {
     const response=   await transporter.sendMail({
            from: '"nagarAarogya" <sybooks1000@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: Welcome_Email_Template.replace("{name}",name)
        })
        // console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
