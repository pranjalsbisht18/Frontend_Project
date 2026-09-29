import GroceryCard from "./Grocerycard.jsx";
import { GrocerGridCard } from "../Utils/Grocery";

function GroceryOption() {
  return (
    <div className="mt-20 ml-20 mr-20 -[80%] container mx-auto">
      <h1 className="text-2xl font-bold text-style">Shop Groceries on Instamart</h1>
      <div className="w-[90%] container mx-auto my-auto flex flex-wrap mt-20 gap-7">
        {GrocerGridCard.map((foodData) => (
          <GroceryCard key={foodData.id} foodData={foodData} />
        ))}
      </div>
    </div>
  );
}

export default GroceryOption;