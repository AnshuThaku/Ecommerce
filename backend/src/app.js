const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();


app.use(cors({
  origin: process.env.VITE_FRONTEND_URL, // Replace with your frontend domain
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/company", require("./routes/companyRoutes"));
app.use("/api/auth",    require("./routes/authRoutes"));
app.use("/api/Superadmin",   require("./routes/superAdminRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes"));
app.use("/api/cart",     require("./routes/addTocartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));
app.use("/api/history",  require("./routes/historyRoutes"));
app.use("/api/home",  require("./routes/homeroutes"));
app.use("/api/theme",  require("./routes/ThemeRoutes"));

// Baaki app.use() ke sath isko daal dein
app.use('/api/payment', require('./routes/paymentRoutes'));

app.use(errorMiddleware);

module.exports = app;