import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";
import { auth } from "./lib/auth";
import blogRouter from "./routes/v1/blog.route";
import commentRouter from "./routes/v1/comment.route";
import userRouter from "./routes/v1/user.route";
import categoryRouter from "./routes/v1/category.route";
import adminRouter from "./routes/v1/admin.route";
import redis_client from "./lib/redis";
import limiter from "./middlewares/rateLimit.middleware";
import helmet from "helmet";
import compression from "compression";

const app = express();

app.use(helmet());
const port = 3000;
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(compression());

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(limiter);
app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/blogs/:blogId/comments", commentRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);

app.use(errorHandler);

redis_client.on("error", (err) => console.log("Redis Client Error", err));
redis_client.on("connect", () => console.log("Redis Client Connected"));
redis_client.on("end", () => console.log("Redis Client Disconnected"));

async function startServer() {
  try {
    await redis_client.connect();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    redis_client.quit();
    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("Closing server...");
  await redis_client.quit();
  process.exit(0);
});

function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.expose ? err.message : "Internal Server Error";
  const stack = process.env.NODE_ENV === "development" ? err.stack : null;
  res.status(statusCode).json({ success: false, message, stack });
}
