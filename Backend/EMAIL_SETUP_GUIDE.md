# Email Configuration Guide

This guide will help you configure email notifications for out-of-stock products.

## Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```
   
   Or manually create a `.env` file in the `Backend` folder.

2. **Fill in your email configuration** in the `.env` file.

3. **Restart your backend server.**

## Gmail Setup (Recommended)

### Step 1: Enable 2-Step Verification
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other (Custom name)**
3. Enter name: "Inventory Management System"
4. Click **Generate**
5. Copy the 16-character password (you'll use this as `EMAIL_PASS`)

### Step 3: Configure .env File
```env
ADMIN_EMAIL=your-admin-email@gmail.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
```
*Note: Remove spaces from the app password when pasting*

## Outlook/Hotmail Setup

### Step 1: Enable App Password
1. Go to: https://account.microsoft.com/security
2. Enable **Two-step verification**
3. Generate an **App password**

### Step 2: Configure .env File
```env
ADMIN_EMAIL=your-admin-email@outlook.com
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-app-password
```

## Yahoo Mail Setup

### Step 1: Generate App Password
1. Go to: https://login.yahoo.com/account/security
2. Enable **Two-step verification**
3. Generate an **App password**

### Step 2: Configure .env File
```env
ADMIN_EMAIL=your-admin-email@yahoo.com
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

## Custom SMTP Server Setup

For other email providers (company emails, custom domains, etc.):

1. **Find your SMTP settings:**
   - Check with your email provider
   - Common ports: 587 (TLS) or 465 (SSL)

2. **Configure .env File:**
```env
ADMIN_EMAIL=admin@yourcompany.com
EMAIL_HOST=smtp.yourcompany.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourcompany.com
EMAIL_PASS=your-password
```

## Verification

After configuring your email:

1. **Start the backend server:**
   ```bash
   cd Backend
   npm run server
   ```

2. **Check the console output:**
   - ✅ Success: `Email Configuration: Ready to send notifications`
   - ❌ Error: Follow the error messages to fix issues

3. **Test by updating a product:**
   - Change a product's quantity from any number to 0
   - Check if you receive an email notification

## Troubleshooting

### Error: "EAUTH - Authentication failed"
- **Solution:** Check your EMAIL_USER and EMAIL_PASS
- For Gmail: Make sure you're using an App Password, not your regular password
- Ensure 2-Step Verification is enabled

### Error: "ECONNECTION - Connection failed"
- **Solution:** Check your EMAIL_HOST and EMAIL_PORT
- Verify your internet connection
- Check if your firewall is blocking the connection

### Error: "ETIMEDOUT - Connection timeout"
- **Solution:** Check your SMTP settings
- Try a different port (587 or 465)
- Check if your network blocks SMTP ports

### No Email Received
- **Check spam folder**
- Verify ADMIN_EMAIL is correct
- Check server console for error messages
- Ensure the product actually went from >0 to 0 (not just set to 0 initially)

## Running Without Email Configuration

**The system works fine without email configuration!**

- You'll see a warning message when starting the server
- The system continues to work normally
- Product management features work as expected
- Only email notifications are disabled

## Security Notes

- **Never commit `.env` file to Git**
- Use App Passwords instead of regular passwords
- Keep your credentials secure
- Rotate passwords regularly

---

**Need Help?** Check the main README.md or HOW_TO_RUN.md files.

