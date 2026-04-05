require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

// Usage: node admin_setup.js <email>
const email = process.argv[2];

if (!email) {
  console.error("Please provide an email address: node admin_setup.js your-email@example.com");
  process.exit(1);
}

async function makeAdmin() {
  try {
    console.log(`Connecting to database...`);
    await mongoose.connect(process.env.MONGO_URI);
    
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { role: "admin" },
      { new: true }
    );

    if (!user) {
      console.error(`Error: User with email '${email}' not found.`);
      process.exit(1);
    }

    console.log(`Success! User '${user.name}' (${user.email}) is now an Admin.`);
    process.exit(0);
  } catch (err) {
    console.error("Critical Error:", err.message);
    process.exit(1);
  }
}

makeAdmin();
