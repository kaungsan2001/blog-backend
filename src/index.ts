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
import redis_client from "./lib/redis";

const app = express();
const port = 8000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use("/api/v1/blogs", blogRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/blogs/:blogId/comments", commentRouter);
app.use("/api/v1/users", userRouter);

app.use(errorHandler);

app
  .listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
  })
  .on("error", (error) => {
    console.log(error);
  });

redis_client.on("error", (err) => console.log("Redis Client Error", err));

await redis_client.connect();

await redis_client.set("foo", "bar");
const result = await redis_client.get("foo");
console.log(result); // >>> bar

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
