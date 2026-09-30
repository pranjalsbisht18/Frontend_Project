import { applyCors, getCoordinates, proxySwiggy } from "../../_lib/swiggy.js";

export default async function handler(request, response) {
    if (applyCors(request, response)) return;

    if (request.method !== "GET") {
        response.setHeader("Allow", "GET, OPTIONS");
        return response.status(405).json({ error: "Method not allowed." });
    }

    const restaurantId = request.query.restaurantId;
    if (typeof restaurantId !== "string" || !/^\d+$/.test(restaurantId)) {
        return response.status(400).json({ error: "A valid restaurant ID is required." });
    }

    const coordinates = getCoordinates(request.query);
    if (!coordinates) {
        return response.status(400).json({ error: "Valid lat and lng query parameters are required." });
    }

    return proxySwiggy("/mapi/menu/pl", {
        "page-type": "REGULAR_MENU",
        "complete-menu": "true",
        ...coordinates,
        restaurantId,
    }, response);
}
