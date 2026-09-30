import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { extractMenuCategories, fetchApi } from "../api";
import RestInfo from "./RestInfo";

function getFoodItems(category) {
    const card = category?.card?.card ?? category;
    return [
        ...(card?.itemCards ?? []),
        ...(card?.categories ?? []).flatMap(getFoodItems),
    ];
}

export default function SearchFood() {
    const { id } = useParams();
    const [food, setFood] = useState("");
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchMenu() {
            try {
                const data = await fetchApi(
                    `/api/restaurants/${encodeURIComponent(id)}/menu?lat=28.7040592&lng=77.10249019999999`,
                    { signal: controller.signal }
                );
                setMenuItems(extractMenuCategories(data));
                setError("");
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Could not load menu items for search:", fetchError);
                    setError(fetchError.message || "Menu items could not be loaded. Please try again later.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchMenu();
        return () => controller.abort();
    }, [id]);

    const query = food.trim().toLowerCase();
    const matchingItems = query
        ? menuItems
            .flatMap(getFoodItems)
            .filter((item) => item?.card?.info?.name?.toLowerCase().includes(query))
        : [];

    return (
        <div className="w-[80%] mx-auto mt-20">
            <input
                className="w-full pl-10 py-4 text-2xl bg-gray-200 runded-2xl border"
                placeholder="Search here"
                value={food}
                onChange={(event) => setFood(event.target.value)}
            />
            {error && <p className="mt-4 text-red-600">{error}</p>}
            {isLoading && <p className="mt-4">Loading menu items…</p>}
            {query && !isLoading && !error && matchingItems.length === 0 && (
                <p className="mt-4">No matching dishes found.</p>
            )}
            <div className="mt-6">
                {matchingItems.map((item) => (
                    <RestInfo
                        key={item?.card?.info?.id}
                        restData={item?.card?.info}
                        isMenuItem={true}
                    />
                ))}
            </div>
        </div>
    );
}
