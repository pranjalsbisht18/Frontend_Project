import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import MenuCard from "./Menucard";
import { extractMenuCategories, fetchApi } from "../api";

export default function RestaurantMenu(){
   
    const { id } = useParams();
    const [menuResult, setMenuResult] = useState({ id: null, items: [], error: "" });
    const [selected, setSelected] = useState(null);

    const isCurrentMenu = menuResult.id === id;
    const restData = isCurrentMenu ? menuResult.items : [];
    const error = isCurrentMenu ? menuResult.error : "";
    const isLoading = !isCurrentMenu;
   
    useEffect(() => {
        const controller = new AbortController();

        async function fetchData() {
            try {
                const data = await fetchApi(
                    `/api/restaurants/${encodeURIComponent(id)}/menu?lat=28.7040592&lng=77.10249019999999`,
                    { signal: controller.signal }
                );
                setMenuResult({
                    id,
                    items: extractMenuCategories(data),
                    error: "",
                });
            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("Could not load the restaurant menu:", fetchError);
                    setMenuResult({
                        id,
                        items: [],
                        error: fetchError.message || "The restaurant menu could not be loaded. Please try again later.",
                    });
                }
            }
        }
   
        fetchData();
        return () => controller.abort();
    }, [id]);

return(
        <div>

        <div className="w-[80%] mx-auto mt-20 mb-20">
          <Link to={`/city/delhi/${id}/search`}>
          <p className="w-full text-center py-4 rounded-4xl bg-gray-200 text-2xl">Search for Dishes</p>
          </Link>
        </div>  

        <div className="w-[80%] mx-auto mt-20 mb-20">
        <button className={`text-2xl py-2 px-8 mr-4 border rounded-2xl ${selected==="veg"? "bg-green-600": "bg-gray-300"} `} onClick={()=>setSelected(selected==='veg'?null:'veg')}>Veg</button>
        <button className={`text-2xl py-2 px-4 border rounded-2xl ${selected==="nonveg"? "bg-red-500": "bg-gray-300"}`} onClick={()=>setSelected(selected==='nonveg'?null:'nonveg')}>Non veg</button>
        </div>
       
        <div className="w-[80%] mx-auto mt-20">
          {error && <p className="mb-4 text-red-600">{error}</p>}
          {isLoading && <p className="mb-4">Loading restaurant menu…</p>}
          {!isLoading && !error && restData.length === 0 && (
            <p className="mb-4">No menu items were returned for this restaurant.</p>
          )}
          {
            restData.map((menuItems)=><MenuCard key={menuItems?.card?.card?.title} menuItems={menuItems?.card?.card} foodselected={selected}></MenuCard>)
          }
        </div>
        </div>
    )

}