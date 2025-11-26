# How to Run the Inventory Management System

This guide will help you run both the Backend and Frontend servers.

## Prerequisites

1. **Node.js** installed (version 14 or higher recommended)
2. **npm** (comes with Node.js)
3. **MongoDB** - Either:
   - MongoDB Atlas account (cloud database - already configured)
   - OR Local MongoDB installation

## Step-by-Step Instructions

### Step 1: Install Dependencies

You need to install dependencies for both Backend and Frontend.

#### Install Backend Dependencies:
```bash
cd Backend
npm install
```

#### Install Frontend Dependencies:
```bash
cd Frontend/inventory_management_system
npm install
```

**Note:** If you're in the root directory, run these commands one after another:
```bash
cd Backend && npm install
cd ../Frontend/inventory_management_system && npm install
cd ../..
```

### Step 2: Set Up Email Configuration (Optional)

If you want email notifications to work:

1. Create a `.env` file in the `Backend` folder
2. Add these variables:
```env
ADMIN_EMAIL=your-admin-email@example.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Note:** The system will work without email configuration, but won't send notifications.

### Step 3: Run the Servers

You need **TWO separate terminal windows/tabs** to run both servers simultaneously.

#### Terminal 1 - Backend Server:

1. Navigate to Backend folder:
   ```bash
   cd Backend
   ```

2. Start the backend server:
   ```bash
   npm run server
   ```

   You should see:
   ```
   ✅ Connected to MongoDB Successfully!
   Example app listening on port 3001
   ```

   The backend will run on: **http://localhost:3001**

#### Terminal 2 - Frontend Server:

1. Navigate to Frontend folder:
   ```bash
   cd Frontend/inventory_management_system
   ```

2. Start the frontend server:
   ```bash
   npm start
   ```

   The frontend will automatically open in your browser at: **http://localhost:3000**

   If it doesn't open automatically, manually visit: `http://localhost:3000`

## Quick Start Commands (Windows PowerShell)

If you're using PowerShell, you can use these commands:

### Terminal 1 (Backend):
```powershell
cd Backend; npm run server
```

### Terminal 2 (Frontend):
```powershell
cd Frontend\inventory_management_system; npm start
```

## Troubleshooting

### Backend Issues:

1. **Port 3001 already in use:**
   - Change the port in `Backend/index.js` to a different port (e.g., 3002)
   - Make sure to update the frontend API calls if needed

2. **MongoDB connection error:**
   - Check your internet connection (if using MongoDB Atlas)
   - Verify the connection string in `Backend/db.js`
   - For local MongoDB, make sure MongoDB service is running

3. **Email configuration error:**
   - This is not critical - the system will continue to work
   - Check console logs for email configuration warnings

### Frontend Issues:

1. **Port 3000 already in use:**
   - React will ask if you want to use a different port (usually 3001)
   - Type 'Y' to confirm

2. **Module not found errors:**
   - Make sure you ran `npm install` in the Frontend folder
   - Delete `node_modules` and `package-lock.json`, then run `npm install` again

3. **Camera not working (Barcode Scanner):**
   - Make sure you allow camera permissions in your browser
   - Use HTTPS in production (localhost works for development)
   - Check browser console for permission errors

## Features Available

Once both servers are running:

1. **User Authentication:**
   - Register/Login pages
   - Protected routes

2. **Product Management:**
   - View all products
   - Add new products
   - Update products
   - Delete products

3. **Barcode Scanner:**
   - Click "Scan" button when adding/updating products
   - Use webcam to scan barcodes

4. **Email Notifications:**
   - Automatic emails when products go out of stock
   - Only works if email is configured

## Stopping the Servers

- **Backend:** Press `Ctrl + C` in the backend terminal
- **Frontend:** Press `Ctrl + C` in the frontend terminal

---

**Happy Coding! 🚀**

