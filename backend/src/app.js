const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/errorMiddleware");
const app = express();


app.use(cors({
  origin: "http://localhost:5173", // Replace with your frontend domain
  credentials: true // Allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/company", require("./routes/companyRoutes/companyRoutes"));
app.use("/api/auth",    require("./routes/authRoutes/authRoutes"));
app.use("/api/Superadmin",   require("./routes/superAdminRoutes/superAdminRoutes"));
app.use("/api/products", require("./routes/productRoutes/productRoutes"));
app.use("/api/reviews",  require("./routes/reviewRoutes/reviewRoutes"));
app.use("/api/admin",    require("./routes/adminRoutes/adminRoutes"));
app.use("/api/cart",     require("./routes/addTocart/addTocartRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes/orderRoutes"));
app.use("/api/history",  require("./routes/historyroutes/historyRoutes"));
app.use("/api/home",  require("./routes/homeRoutes/homeroutes"));

app.use(errorMiddleware);

module.exports = app;