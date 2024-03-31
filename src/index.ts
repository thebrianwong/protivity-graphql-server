import express from "express";
import http from "http";
import cors from "cors";

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

app.use("/", async (req, res, next) => {
  res.send("This is a GraphQL server. Make a request at /graphql");
});

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
