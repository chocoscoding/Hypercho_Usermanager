import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/Mongodb";
import logg from "./Logs/Customlog";
import { LikesAndDislikesRoute, ViewsRoute, CommentsRoute, SubscriptionRoute, UserManagerRoute, WatchLaterRoute } from "./Routes";
dotenv.config();
const PORT: number | string = process.env.PORT || 9979;
const app: Express = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/LikeAndDislike", LikesAndDislikesRoute);
app.use("/Views", ViewsRoute);
app.use("/Subscription", SubscriptionRoute);
app.use("/Comments", CommentsRoute);
app.use("/Settings", UserManagerRoute);
app.use("/Watchlater", WatchLaterRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("<h1>Welcome to the user management service</h1>");
});

const start = async () => {
  const MONGO_URI: any = process.env.MONGO_URI;
  try {
    await connectDB(MONGO_URI);
    app.listen(PORT, () => logg.info(`Running on http://localhost:${PORT} ⚡`));
  } catch (error) {
    logg.fatal(error);
  }
};

start();
