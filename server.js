import * as dotenv from "dotenv";

import { Configuration, OpenAIApi } from "openai";
import path, { dirname } from "path";

import cors from "cors";
import express from "express";
import { fileURLToPath } from "url";

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI,
});

const openai = new OpenAIApi(configuration);

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "index.html"));
});

app.get("/style.css", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "style.css"));
});

app.get("/main.js", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "main.js"));
});

app.post("/dream", async (req, res) => {
    try {
        const prompt = req.body.prompt;

        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: "1024x1024",
        });

        const image = aiResponse.data.data[0].url;
        res.send({ image });
    } catch (error) {
        console.error(error);
        res.status(500).send(
            error?.response.data.error.message || "Something went wrong"
        );
    }
});

app.listen(8080, () => console.log("make art on http://localhost:8080/dream"));
