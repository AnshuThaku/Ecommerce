require('dotenv').config();

// 1. Uncaught Exception: Agar kisi synchronous code me achanak koi aisi error aaye jo handle na ho (jaise variable not defined)
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥 Server band hone se bach gaya, par error solve karein:');
    console.error(err.name, err.message);
});

const app = require("./src/app");
const { connectDb } = require("./src/config/dbConfig/db");

connectDb();

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080...');
});

// 2. Unhandled Rejection: Agar koi Promise (async await) fail ho jaye aur uspe try-catch na laga ho (jaise Database down ho jaye)
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥 Server gracefully handle kar raha hai:');
    console.error(err.name, err.message);
    // Real time me yaha hum log bhej sakte hain aur chahein toh gracefully server close karke restart kar sakte hain
});