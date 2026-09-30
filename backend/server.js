import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
const port = Number(process.env.PORT) || 3001;
const upstreamBaseUrl = process.env.SWIGGY_API_BASE_URL || "https://www.swiggy.com";
const frontendDist = resolve(dirname(fileURLToPath(import.meta.url)), "../dist");
const frontendIndex = resolve(frontendDist, "index.html");

app.use(cors());

function getCoordinates(request, response) {
    const lat = Number(request.query.lat);
    const lng = Number(request.query.lng);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
        !Number.isFinite(lng) || lng < -180 || lng > 180) {
        response.status(400).json({ error: "Valid lat and lng query parameters are required." });
        return null;
    }

    return { lat: String(lat), lng: String(lng) };
}

async function fetchSwiggy(path, query, response) {
    let upstreamUrl;

    try {
        upstreamUrl = new URL(path, upstreamBaseUrl);
    } catch (error) {
        console.error("Invalid SWIGGY_API_BASE_URL:", error);
        response.status(500).json({ error: "The upstream API is not configured correctly." });
        return;
    }

    upstreamUrl.search = new URLSearchParams(query).toString();

    try {
        const upstreamResponse = await fetch(upstreamUrl, {
            headers: {
                Accept: "application/json",
                "Accept-Language": "en-US,en;q=0.9",
                Referer: "https://www.swiggy.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
            },
            signal: AbortSignal.timeout(15000),
        });

        if (!upstreamResponse.ok) {
            console.error(`Swiggy returned HTTP ${upstreamResponse.status} for ${path}`);
            return response.status(502).json({ error: "The restaurant data provider rejected the request." });
        }

        const data = await upstreamResponse.json();
        return response.json(data);
    } catch (error) {
        if (error.name === "TimeoutError") {
            console.error(`Swiggy request timed out for ${path}`);
            return response.status(504).json({ error: "The restaurant data provider timed out." });
        }

        console.error("Could not fetch restaurant data from Swiggy:", error);
        return response.status(502).json({ error: "Could not fetch restaurant data from the provider." });
    }
}

app.get("/api/health", (_request, response) => {
    response.json({ status: "ok" });
});

app.get("/api/restaurants", (request, response) => {
    const coordinates = getCoordinates(request, response);
    if (!coordinates) return;

    return fetchSwiggy("/dapi/restaurants/list/v5", {
        ...coordinates,
        "is-seo-homepage-enabled": "true",
    }, response);
});

app.get("/api/restaurants/:restaurantId/menu", (request, response) => {
    const { restaurantId } = request.params;
    if (!/^\d+$/.test(restaurantId)) {
        return response.status(400).json({ error: "A valid restaurant ID is required." });
    }

    const coordinates = getCoordinates(request, response);
    if (!coordinates) return;

    return fetchSwiggy("/mapi/menu/pl", {
        "page-type": "REGULAR_MENU",
        "complete-menu": "true",
        ...coordinates,
        restaurantId,
    }, response);
});

app.use(express.static(frontendDist));
app.get(/.*/, (request, response, next) => {
    if (request.path.startsWith("/api/")) {
        return next();
    }
    if (existsSync(frontendIndex)) {
        return response.sendFile(frontendIndex);
    }
    return next();
});

app.use((request, response) => {
    response.status(404).json({ error: "API route not found." });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Restaurant API listening on port ${port}`);
});
