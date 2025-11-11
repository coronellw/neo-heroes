import express from "express";
import cors from "cors";
import characterRoutes from "./routes/characters";
import battleRoutes from "./routes/battle";

const app = express();

const port = process.env.PORT || 5555;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/characters", characterRoutes);
app.use("/api/battle", battleRoutes);

app.listen(port, () => {
    console.log(`Neo Hero is running at port ${port}`)
})
