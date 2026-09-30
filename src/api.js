const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

export async function fetchApi(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, options);
    } catch (error) {
        if (error.name === "AbortError") {
            throw error;
        }
        throw new Error(
            `Could not reach the restaurant API at ${API_BASE_URL || window.location.origin}. Check that the backend is deployed and VITE_API_BASE_URL is correct.`,
            { cause: error }
        );
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        throw new Error(
            `Restaurant API returned HTTP ${response.status} with ${contentType || "an unexpected response"} instead of JSON at ${response.url}. Check that the deployed API URL points to the backend.`
        );
    }

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error || `Restaurant API request failed (${response.status}) at ${response.url}`);
    }

    return data;
}

export function extractRestaurants(data) {
    const cards = data?.data?.cards;
    if (!Array.isArray(cards)) return [];

    return cards.flatMap((entry) => {
        const restaurants = entry?.card?.card?.gridElements?.infoWithStyle?.restaurants;
        return Array.isArray(restaurants) ? restaurants : [];
    });
}

export function extractMenuCategories(data) {
    const cards = data?.data?.cards;
    if (!Array.isArray(cards)) return [];

    const menuCards = cards.flatMap((entry) => {
        const groupedCards = entry?.groupedCard?.cardGroupMap?.REGULAR?.cards;
        return Array.isArray(groupedCards) ? groupedCards : [];
    });

    return menuCards.filter((entry) => entry?.card?.card && "title" in entry.card.card);
}
