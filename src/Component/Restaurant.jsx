import { useEffect, useState } from "react";
import RestCard from "./RestCard";
import Shimmer from "./Shimmer";
import { extractRestaurants, fetchApi } from "../api";

export default function Restaurant(){

    const [restData, setRestData] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                const data = await fetchApi(
                    "/api/restaurants?lat=28.7040592&lng=77.10249019999999",
                    { signal: controller.signal }
                );
                setRestData(extractRestaurants(data));
                setError("");
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Could not load restaurants:", fetchError);
                    setError(fetchError.message || "Restaurants could not be loaded. Please try again later.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        fetchData();
        return () => controller.abort();
    }, []);

    if (isLoading)
        return <Shimmer />;

    if (error)
        return <p className="w-[80%] mx-auto mt-20 text-red-600">{error}</p>;

    if (restData.length === 0)
        return <p className="w-[80%] mx-auto mt-20">No restaurants were returned for this location.</p>;

    return (
        <div className="w-[80%] mx-auto mt-20">
            <h2 className="text-3xl font-bold">Restaurants near you</h2>
            <div className="flex flex-wrap gap-5 mt-5">
                {restData.map((restInfo) => (
                    <RestCard key={restInfo?.info?.id} restInfo={restInfo} />
                ))}
            </div>
        </div>
    )

}