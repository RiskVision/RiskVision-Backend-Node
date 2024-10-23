import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";


import aiRouter from "./routes/ai.routes.js";
import nvdRouter from "./routes/nvd.routes.js"
import reportRouter from "./routes/reports.routes.js"
import loginRouter from "./routes/login.js"

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/ai", aiRouter);
app.use("/nvd", nvdRouter);
app.use("/reports", reportRouter);
app.use('/login', loginRouter );

//Healthcheck endpoint
app.get('/healthcheck', (req, res) => {
    res.send('Hello World!')
  })

app.listen(8000, console.log("http://localhost:8000"));
