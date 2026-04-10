require('dotenv').config();


const app = require("./src/app");
const { connectDb } = require("./src/config/db");
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

connectDb();
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
});


app.use((err, req, res, next) => {
    console.error('GLOBAL ERROR HANDLER: ', err);
    res.status(500).json({
        success: false,
        message: 'something is wrong'
    });
});