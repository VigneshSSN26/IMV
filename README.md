# Inventory Management System MERN CRUD App

A MERN project that lets the user insert, update, delete & get products from the MongoDB. The system includes:
- **Email Notifications**: Automatic email alerts to admin when products go out of stock
- **Barcode Scanner**: Webcam-based barcode scanning for quick product entry
- **User Authentication**: Secure login and registration system

## To Run App:

### 1. Open the folder in vs code and run (npm install) command.
   
### 2. In MongoDB Compass:
   - Create Database: IMS
   - Collection Name: products

### 3. Then in vs code, open two terminals in split:
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/86ed0828-84b8-43b0-89fd-8caa17b88833)

### 4. In one terminal run these commands (For Backend / Server):
   - cd Backend
   - npm run server

### 5. In the other terminal run these commands (For Frontend / Client):
   - cd Frontend
   - cd inventory_management_system
   - npm start
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/93fa528b-bc88-49c2-9922-19b317336b7c)

## Output:
### 1. GET (Displaying products)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/09f7d43a-344b-4122-b415-b3736307cf45)

### 2. POST (Inserting a new product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d31e9f36-c119-4a04-9cc0-ddc9fe94b159)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/39ec387f-5efc-4c1f-a7eb-a87612acc17a)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/a6b5c6bf-77d7-41ab-9ca0-3a8bfc71954d)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/3d43e877-c2e6-414b-bef9-410caae1668e)

### 3. PUT (Updating a product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d35f7ab0-3fda-4b1c-9055-67ca8c7b2ab6)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/7dd107db-6fde-416d-b5c6-2175916f872f)

### 4. DELETE (Deleting a product)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/d846ff43-6abd-4baa-9ed6-df736f2d411e)
   ![image](https://github.com/mhy20401/Inventory-Management-System-MERN-CRUD-Project/assets/99351091/cc6368bd-f391-4d6b-b814-c931d48a0878)

## New Features

### Email Notifications for Out-of-Stock Products

The system automatically sends email notifications to the admin when a product goes out of stock.

#### Setup Instructions:

1. **Set Environment Variables** (create a `.env` file in the `Backend` folder):
   ```
   ADMIN_EMAIL=your-admin-email@example.com
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

2. **For Gmail Users:**
   - Enable 2-Factor Authentication on your Google Account
   - Generate an App Password: Go to Google Account > Security > 2-Step Verification > App Passwords
   - Use this app password as `EMAIL_PASS`

3. **For Other Email Providers:**
   - Update `EMAIL_HOST` and `EMAIL_PORT` according to your provider's SMTP settings
   - Common providers:
     - Outlook: `smtp-mail.outlook.com` (port 587)
     - Yahoo: `smtp.mail.yahoo.com` (port 587)
     - Custom SMTP: Check with your email provider

4. **Note:** If email is not configured, the system will log a warning but continue to function normally.

### Barcode Scanner with Webcam

The system includes a built-in barcode scanner that uses your webcam to quickly scan product barcodes.

#### How to Use:

1. When adding or updating a product, click the **"Scan"** button next to the barcode field
2. Allow camera permissions when prompted by your browser
3. Point your webcam at a barcode
4. The barcode will be automatically detected and filled in
5. The scanner supports multiple camera devices - select your preferred camera if you have multiple

#### Browser Requirements:

- **Modern browsers**: Chrome, Firefox, Edge, Safari (latest versions)
- **HTTPS required** for production (localhost works for development)
- **Camera permissions**: Make sure to allow camera access when prompted

#### Supported Barcode Formats:
- EAN-13
- EAN-8
- UPC-A
- UPC-E
- Code 128
- Code 39
- And more (depends on ZXing library support)
