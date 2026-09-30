const UPSTREAM_BASE_URL = process.env.SWIGGY_API_BASE_URL || "https://www.swiggy.com";

export function applyCors(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (request.method === "OPTIONS") {
        response.status(204).end();
        return true;
    }

    return false;
}

export function getCoordinates(query) {
    const lat = Number(query.lat);
    const lng = Number(query.lng);

    if (!Number.isFinite(lat) || lat < -90 || lat > 90 ||
        !Number.isFinite(lng) || lng < -180 || lng > 180) {
        return null;
    }

    return { lat: String(lat), lng: String(lng) };
}

export async function proxySwiggy(path, query, response) {
    let upstreamUrl;

    try {
        upstreamUrl = new URL(path, UPSTREAM_BASE_URL);
    } catch (error) {
        console.error("Invalid SWIGGY_API_BASE_URL:", error);
        return response.status(500).json({ error: "The upstream API is not configured correctly." });
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
        return response.status(200).json(data);
    } catch (error) {
        if (error.name === "TimeoutError") {
            console.error(`Swiggy request timed out for ${path}`);
            return response.status(504).json({ error: "The restaurant data provider timed out." });
        }

        console.error("Could not fetch restaurant data from Swiggy:", error);
        return response.status(502).json({ error: "Could not fetch restaurant data from the provider." });
    }
}
