import express from "express";
import cors from "cors";


import cartRouter from "./routes/Cart.route.js";
import couponRouter from "./routes/Coupon.route.js";
import employeeRouter from "./routes/Employee.route.js";
import orderRouter from "./routes/Order.route.js";
import productRouter from "./routes/Product.route.js";
import reviewRouter from "./routes/Review.route.js";
import userRouter from "./routes/User.route.js";

const app = express();

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/v1/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the MyClass API v1",
  });
});

app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/review", reviewRouter);
app.use('/api/v1/user', userRouter); 

export default app;