import { imageGridCards } from "../Utils/FoodData"
import FoodCard from "./FoodCard.jsx"
 function FoodOption(){


       return(
      <>
      <div className="w-[80%] container mx-auto flex flex-wrap mt-20 gap-3">
        {
            imageGridCards.map((foodData) => (
              <FoodCard key={foodData.id} foodData={foodData} />
            ))
        }

      </div>

      </>

       );


}

export default FoodOption;