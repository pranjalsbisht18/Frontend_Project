import { useState } from "react";

const cities = [
  { name: "Bangalore", slug: "bangalore" },
  { name: "Gurgaon", slug: "gurgaon" },
  { name: "Hyderabad", slug: "hyderabad" },
  { name: "Delhi", slug: "delhi" },
  { name: "Mumbai", slug: "mumbai" },
  { name: "Pune", slug: "pune" },
  { name: "Kolkata", slug: "kolkata" },
  { name: "Chennai", slug: "chennai" },
  { name: "Ahmedabad", slug: "ahmedabad" },
  { name: "Chandigarh", slug: "chandigarh" },
  { name: "Jaipur", slug: "jaipur" },
  { name: "Lucknow", slug: "lucknow" },
  { name: "Kochi", slug: "kochi" },
  { name: "Coimbatore", slug: "coimbatore" },
  { name: "Indore", slug: "indore" },
  { name: "Nagpur", slug: "nagpur" },
  { name: "Surat", slug: "surat" },
  { name: "Visakhapatnam", slug: "visakhapatnam" },
  { name: "Bhopal", slug: "bhopal" },
  { name: "Patna", slug: "patna" },
];

export default function CityFoodDelivery() {
  const [showAllCities, setShowAllCities] = useState(false);
  const visibleCities = showAllCities ? cities : cities.slice(0, 11);

  return (
    <section className="mx-auto mb-16 mt-12 max-w-6xl px-6">
      <h2 className="mb-4 text-2xl font-bold text-gray-900">
        Cities with food delivery
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {visibleCities.map((city) => (
          <a
            key={city.slug}
            href={`https://www.swiggy.com/city/${city.slug}`}
            className="flex min-h-12 items-center justify-center rounded-xl border border-gray-200 px-3 py-3 text-center text-sm font-medium text-gray-700 hover:border-orange-500 hover:text-orange-600"
          >
            Order food online in {city.name}
          </a>
        ))}

        <button
          className="min-h-12 rounded-xl border border-gray-200 px-3 py-3 font-semibold text-orange-600 hover:border-orange-500"
          onClick={() => setShowAllCities(!showAllCities)}
          aria-expanded={showAllCities}
        >
          {showAllCities ? "Show less ↑" : "Show more ↓"}
        </button>
      </div>
    </section>
  );
}
