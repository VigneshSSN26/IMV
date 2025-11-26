const mongoose = require('mongoose');

// For MongoDB Atlas
const mongoURI = "mongodb+srv://vigneshmt27_db_user:yzmSoOhSUpIPV0w2@cluster0.q09sfoc.mongodb.net/IMS?retryWrites=true&w=majority&appName=Cluster0";

// For Local MongoDB (alternative)
// const mongoURI = "mongodb://localhost:27017/IMS";

const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds timeout for Atlas
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      socketTimeoutMS: 30000, // 30 seconds socket timeout
    });
    console.log("✅ Connected to MongoDB Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    if (error.message.includes('IP')) {
      console.error("💡 Tip: Check your IP whitelist in MongoDB Atlas Network Access settings");
    }
    if (error.message.includes('authentication')) {
      console.error("💡 Tip: Verify your database username and password");
    }
    process.exit(1); // Exit the process if database connection fails
  }
};

module.exports = connectToMongo;
