import { applyCors, getCoordinates, proxySwiggy } from "./_lib/swiggy.js";

export default async function handler(request, response) {
    if (applyCors(request, response)) return;

    if (request.method !== "GET") {
        response.setHeader("Allow", "GET, OPTIONS");
        return response.status(405).json({ error: "Method not allowed." });
    }

    const coordinates = getCoordinates(request.query);
    if (!coordinates) {
        return response.status(400).json({ error: "Valid lat and lng query parameters are required." });
    }

    return proxySwiggy("/dapi/restaurants/list/v5", {
        ...coordinates,
        "is-seo-homepage-enabled": "true",
    }, response);
}
