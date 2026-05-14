export const Verification_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - nagarAarogya</title>
      <style>
          body {
              font-family: 'Segoe UI', system-ui, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #0f1219;
              color: #ffffff;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #161A24;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
              overflow: hidden;
              border: 1px solid #364153;
          }
          .header {
              background: linear-gradient(135deg, #1E1E1E 0%, #2a2a2a 100%);
              padding: 40px 20px;
              text-align: center;
              border-bottom: 1px solid #364153;
          }
          .header h1 {
              margin: 0;
              font-size: 26px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.5px;
          }
          .logo {
              font-size: 32px;
              font-weight: 800;
              color: #5D84F9;
              margin-bottom: 8px;
          }
          .content {
              padding: 40px 35px;
              background: #161A24;
          }
          .welcome-message {
              font-size: 22px;
              font-weight: 600;
              margin: 0 0 20px 0;
              color: #ffffff;
          }
          .subtitle {
              font-size: 16px;
              color: #a0a0a0;
              margin-bottom: 25px;
          }
          .description {
              color: #d1d5db;
              margin-bottom: 25px;
              font-size: 15.5px;
          }

          /* Verification Code Box */
          .verification-code {
              display: block;
              margin: 30px 0;
              font-size: 28px;
              font-weight: 700;
              letter-spacing: 8px;
              color: #5D84F9;
              background: #1C2635;
              border: 2px dashed #5D84F9;
              padding: 20px;
              text-align: center;
              border-radius: 12px;
              box-shadow: 0 4px 15px rgba(93, 132, 249, 0.15);
          }

          .button {
              display: inline-block;
              background-color: #5D84F9;
              color: #ffffff !important;
              padding: 14px 32px;
              margin: 20px 0;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              box-shadow: 0 4px 15px rgba(93, 132, 249, 0.3);
              border: 1px solid #5D84F9;
          }

          .footer {
              background: #1E1E1E;
              padding: 25px;
              text-align: center;
              color: #777;
              font-size: 13px;
              border-top: 1px solid #364153;
          }
          p {
              margin: 0 0 16px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo">nagarAarogya</div>
              <h1>Verify Your Email</h1>
          </div>

          <!-- Content -->
          <div class="content">
              <p class="welcome-message">Hello User,</p>
              <p class="subtitle">Almost there! Please verify your email address.</p>
              
              <p class="description">
                  Thank you for signing up with nagarAarogya. To complete your registration and activate your account, 
                  please use the verification code below:
              </p>

              <span class="verification-code">{verificationCode}</span>

              <p style="color: #a0a0a0; font-size: 15px;">
                  This code will expire in <strong>10 minutes</strong> for security reasons.
              </p>

              <p style="color: #d1d5db;">
                  If you did not create an account, you can safely ignore this email.
              </p>

              <a href=${process.env.FRONTEND_URL} class="button" style="color: #ffffff !important;">
                  <span>Open nagarAarogya</span>
              </a>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} nagarAarogya. All rights reserved.</p>
              <p style="margin-top: 8px; font-size: 12px;">
                  Making healthcare accessible across the city.
              </p>
          </div>
      </div>
  </body>
  </html>
`;



export const Welcome_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to nagarAarogya</title>
      <style>
          body {
              font-family: 'Segoe UI', system-ui, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #0f1219;
              color: #ffffff;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #161A24;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
              overflow: hidden;
              border: 1px solid #364153;
          }
          .header {
              background: linear-gradient(135deg, #1E1E1E 0%, #2a2a2a 100%);
              padding: 40px 20px;
              text-align: center;
              border-bottom: 1px solid #364153;
          }
          .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.5px;
          }
          .logo {
              font-size: 32px;
              font-weight: 800;
              color: #5D84F9;
              margin-bottom: 8px;
          }
          .content {
              padding: 40px 35px;
              background: #161A24;
          }
          .welcome-message {
              font-size: 22px;
              font-weight: 600;
              margin: 0 0 20px 0;
              color: #ffffff;
          }
          .subtitle {
              font-size: 16px;
              color: #a0a0a0;
              margin-bottom: 25px;
          }
          .description {
              color: #d1d5db;
              margin-bottom: 25px;
              font-size: 15.5px;
          }
          .features {
              background: #1C2635;
              border: 1px solid #364153;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
          }
          .features ul {
              list-style: none;
              padding: 0;
              margin: 0;
          }
          .features li {
              padding: 12px 0;
              color: #d1d5db;
              font-size: 15px;
              display: flex;
              align-items: flex-start;
              gap: 12px;
          }
          .features li:before {
              content: "✓";
              color: #5D84F9;
              font-weight: bold;
              flex-shrink: 0;
          }
          .button {
              display: inline-block;
              background: #5D84F9;
              color: #ffffff !important;
              padding: 14px 32px;
              margin: 25px 0;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              box-shadow: 0 4px 15px rgba(93, 132, 249, 0.3);
              transition: all 0.3s ease;
          }
          .button:hover {
              background: #4a6ee6;
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(93, 132, 249, 0.4);
          }
          .footer {
              background: #1E1E1E;
              padding: 25px;
              text-align: center;
              color: #777;
              font-size: 13px;
              border-top: 1px solid #364153;
          }
          p {
              margin: 0 0 16px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo">nagarAarogya</div>
              <h1>Welcome Aboard</h1>
          </div>

          <!-- Content -->
          <div class="content">
              <p class="welcome-message">Hello {name},</p>
              <p class="subtitle">We're excited to have you as part of our healthcare community.</p>
              
              <p class="description">
                  Your registration was successful. nagarAarogya is a modern city-wide hospital management platform 
                  designed to make healthcare more accessible, efficient, and connected.
              </p>

              <div class="features">
                  <ul>
                      <li>Connect instantly with nearby hospitals and healthcare providers</li>
                      <li>Streamlined appointment booking and management</li>
                      <li>Secure digital health records and patient history</li>
                      <li>Real-time updates and seamless hospital operations</li>
                  </ul>
              </div>

              <a href=${process.env.FRONTEND_URL} class="button">Get Started Now</a>

              <p style="color: #a0a0a0; font-size: 15px;">
                  If you have any questions or need assistance, our support team is always here to help.
              </p>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} nagarAarogya. All rights reserved.</p>
              <p style="margin-top: 8px; font-size: 12px;">
                  Making healthcare accessible across the city.
              </p>
          </div>
      </div>
  </body>
  </html>
`;
export const Confirmation_Email_Template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to nagarAarogya</title>
      <style>
          body {
              font-family: 'Segoe UI', system-ui, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #0f1219;
              color: #ffffff;
              line-height: 1.6;
          }
          .container {
              max-width: 600px;
              margin: 30px auto;
              background: #161A24;
              border-radius: 16px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
              overflow: hidden;
              border: 1px solid #364153;
          }
          .header {
              background: linear-gradient(135deg, #1E1E1E 0%, #2a2a2a 100%);
              padding: 40px 20px;
              text-align: center;
              border-bottom: 1px solid #364153;
          }
          .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.5px;
          }
          .logo {
              font-size: 32px;
              font-weight: 800;
              color: #5D84F9;
              margin-bottom: 8px;
          }
          .content {
              padding: 40px 35px;
              background: #161A24;
          }
          .welcome-message {
              font-size: 22px;
              font-weight: 600;
              margin: 0 0 20px 0;
              color: #ffffff;
          }
          .subtitle {
              font-size: 16px;
              color: #a0a0a0;
              margin-bottom: 25px;
          }
          .description {
              color: #d1d5db;
              margin-bottom: 25px;
              font-size: 15.5px;
          }
          .features {
              background: #1C2635;
              border: 1px solid #364153;
              border-radius: 12px;
              padding: 25px;
              margin: 30px 0;
          }
          .features ul {
              list-style: none;
              padding: 0;
              margin: 0;
          }
          .features li {
              padding: 12px 0;
              color: #d1d5db;
              font-size: 15px;
              display: flex;
              align-items: flex-start;
              gap: 12px;
          }
          .features li:before {
              content: "✓";
              color: #5D84F9;
              font-weight: bold;
              flex-shrink: 0;
          }
          .button {
              display: inline-block;
              background: #5D84F9;
              color: #ffffff !important;
              padding: 14px 32px;
              margin: 25px 0;
              text-decoration: none;
              border-radius: 8px;
              font-size: 16px;
              font-weight: 600;
              text-align: center;
              box-shadow: 0 4px 15px rgba(93, 132, 249, 0.3);
              transition: all 0.3s ease;
          }
          .button:hover {
              background: #4a6ee6;
              transform: translateY(-2px);
              box-shadow: 0 6px 20px rgba(93, 132, 249, 0.4);
          }
          .footer {
              background: #1E1E1E;
              padding: 25px;
              text-align: center;
              color: #777;
              font-size: 13px;
              border-top: 1px solid #364153;
          }
          p {
              margin: 0 0 16px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <!-- Header -->
          <div class="header">
              <div class="logo">nagarAarogya</div>
              <h1>Information Regarding Your Registration In nagarAarogya</h1>
          </div>

          <!-- Content -->
          <div class="content">
              
              <p class="description">
                  {message}
              </p>


              
              <p style="color: #a0a0a0; font-size: 15px;">
                  If you have any questions or need assistance, our support team is always here to help.
              </p>
          </div>

          <!-- Footer -->
          <div class="footer">
              <p>&copy; ${new Date().getFullYear()} nagarAarogya. All rights reserved.</p>
              <p style="margin-top: 8px; font-size: 12px;">
                  Making healthcare accessible across the city.
              </p>
          </div>
      </div>
  </body>
  </html>
`;