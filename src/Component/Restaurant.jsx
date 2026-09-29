import { useEffect, useState } from "react";
import RestCard from "./RestCard";
import Shimmer from "./Shimmer";

export default function Restaurant(){
   
    const [restData, setRestData] = useState([])

    useEffect(()=>{
     async function fetchData() {
        const swiggyAPI = "/api/swiggy/dapi/restaurants/list/v5?lat=28.7040592&lng=77.10249019999999&is-seo-homepage-enabled=true";
        const response = await fetch(swiggyAPI);
        const data = await response.json();
        const restaurants = data?.data?.cards?.[1]?.card?.card?.gridElements?.infoWithStyle?.restaurants ?? [];
        setRestData(restaurants);
     }

     fetchData();
    },[])

    if(restData.length === 0)
        return <Shimmer></Shimmer>

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