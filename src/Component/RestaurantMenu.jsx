import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import MenuCard from "./Menucard";

export default function RestaurantMenu(){
   
    const { id } = useParams();
    const [restData, setRestData] = useState([]);
    const [selected, setSelected] = useState(null);
   
    useEffect(()=>{
        async function fetchData() {
          const swiggyAPI = `/api/swiggy/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
          const response = await fetch(swiggyAPI);
          const data = await response.json();
          const tempData = data?.data?.cards?.[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards ?? [];
          const filterData = tempData.filter((items) => items?.card?.card && 'title' in items.card.card);
          setRestData(filterData);
        }
   
        fetchData();
       }, [id])

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
          {
            restData.map((menuItems)=><MenuCard key={menuItems?.card?.card?.title} menuItems={menuItems?.card?.card} foodselected={selected}></MenuCard>)
          }
        </div>
        </div>
    )

}