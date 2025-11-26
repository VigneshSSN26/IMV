const nodemailer = require('nodemailer');

// Email configuration - Use environment variables for production
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@inventorysystem.com'; // Replace with actual admin email
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT) || 587;
const EMAIL_USER = process.env.EMAIL_USER || ''; // Your email
const EMAIL_PASS = process.env.EMAIL_PASS || ''; // Your email app password

// Check if email is configured
const isEmailConfigured = !!(EMAIL_USER && EMAIL_PASS);

// Create transporter only if email is configured
let transporter = null;

if (isEmailConfigured) {
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, // true for 465, false for other ports
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    },
    tls: {
      // Do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  // Verify transporter configuration (non-blocking)
  transporter.verify(function(error, success) {
    if (error) {
      console.log('\n❌ Email Configuration Error:');
      console.log('   Error:', error.message);
      console.log('   Status: Email notifications will NOT be sent');
      console.log('\n💡 To fix email configuration:');
      console.log('   1. Create a .env file in the Backend folder');
      console.log('   2. Add the following variables:');
      console.log('      ADMIN_EMAIL=your-admin-email@example.com');
      console.log('      EMAIL_HOST=smtp.gmail.com');
      console.log('      EMAIL_PORT=587');
      console.log('      EMAIL_USER=your-email@gmail.com');
      console.log('      EMAIL_PASS=your-app-password');
      console.log('   3. For Gmail, create an App Password at:');
      console.log('      https://myaccount.google.com/apppasswords');
      console.log('   4. Restart the server\n');
    } else {
      console.log('\n✅ Email Configuration:');
      console.log('   Status: Ready to send notifications');
      console.log('   Admin Email:', ADMIN_EMAIL);
      console.log('   SMTP Server:', EMAIL_HOST + ':' + EMAIL_PORT);
      console.log('');
    }
  });
} else {
  console.log('\n⚠️  Email Configuration:');
  console.log('   Status: NOT configured - Email notifications disabled');
  console.log('   The system will continue to work normally');
  console.log('   To enable email notifications, set EMAIL_USER and EMAIL_PASS environment variables');
  console.log('   See HOW_TO_RUN.md or README.md for setup instructions\n');
}

// Function to send out-of-stock notification
const sendOutOfStockNotification = async (product) => {
  if (!isEmailConfigured || !transporter) {
    console.log(`⚠️ Email not configured. Skipping notification for: ${product.ProductName}`);
    return false;
  }

  const mailOptions = {
    from: `"Inventory Management System" <${EMAIL_USER}>`,
    to: ADMIN_EMAIL,
    subject: `⚠️ Product Out of Stock: ${product.ProductName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f8f9fa; padding: 30px; border: 1px solid #dee2e6; }
          .product-details { background-color: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #dc3545; }
          .detail-row { margin: 10px 0; }
          .label { font-weight: bold; color: #666; }
          .value { color: #333; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⚠️ Product Out of Stock Alert</h1>
          </div>
          <div class="content">
            <p>Dear Admin,</p>
            <p>A product in your inventory has gone out of stock. Please take necessary action to restock.</p>
            
            <div class="product-details">
              <div class="detail-row">
                <span class="label">Product Name:</span>
                <span class="value">${product.ProductName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Barcode:</span>
                <span class="value">${product.ProductBarcode}</span>
              </div>
              <div class="detail-row">
                <span class="label">Price:</span>
                <span class="value">₹${product.ProductPrice}</span>
              </div>
              <div class="detail-row">
                <span class="label">Available Quantity:</span>
                <span class="value" style="color: #dc3545; font-weight: bold;">${product.ProductAvailable}</span>
              </div>
            </div>
            
            <p>Please restock this product as soon as possible to avoid running out of inventory.</p>
            <p>Thank you,<br>Inventory Management System</p>
          </div>
          <div class="footer">
            <p>This is an automated notification. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Product Out of Stock Alert
      
      Dear Admin,
      
      A product in your inventory has gone out of stock:
      
      Product Name: ${product.ProductName}
      Barcode: ${product.ProductBarcode}
      Price: ₹${product.ProductPrice}
      Available Quantity: ${product.ProductAvailable}
      
      Please restock this product as soon as possible.
      
      Thank you,
      Inventory Management System
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Out-of-stock notification email sent successfully`);
    console.log(`   Product: ${product.ProductName}`);
    console.log(`   Sent to: ${ADMIN_EMAIL}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending out-of-stock notification:');
    console.error('   Product:', product.ProductName);
    console.error('   Error:', error.message);
    
    // Provide helpful error messages
    if (error.code === 'EAUTH') {
      console.error('   💡 Authentication failed - Check your EMAIL_USER and EMAIL_PASS');
    } else if (error.code === 'ECONNECTION') {
      console.error('   💡 Connection failed - Check your EMAIL_HOST and EMAIL_PORT');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('   💡 Connection timeout - Check your internet connection and SMTP settings');
    }
    
    return false;
  }
};

module.exports = {
  sendOutOfStockNotification,
  ADMIN_EMAIL
};

