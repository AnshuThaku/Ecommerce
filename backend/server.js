require('dotenv').config();


const app = require("./src/app");
const { connectDb } = require("./src/config/db");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDb();

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080...');
});


app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR HANDLER: ', err);
    res.status(500).json({
        success: false,
        message: 'Kuch toh gadbad hai! Server error ho gaya.'
    });
});