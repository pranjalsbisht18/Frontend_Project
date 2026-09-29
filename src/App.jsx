import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./Component/Home.jsx";
import Restaurant from "./Component/Restaurant.jsx";
import RestaurantMenu from "./Component/RestaurantMenu.jsx";
import SearchFood from "./Component/SearchFood.jsx";
import SecondaryHome from "./Component/SecondaryHome.jsx";
import { store } from "./Stored/Stores.jsx";
import {Provider} from "react-redux"
import Checkout from "./Component/Checkout.jsx";
import Fotter from "./Component/fotter.jsx";
import ScanQr from "./Component/ScanQr.jsx";
import CityFoodDelivery from "./Component/CityFoodDelivery.jsx";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                    <ScanQr />
                    <CityFoodDelivery />
                  </>
                }
              />
              <Route element={<SecondaryHome />}>
                <Route path="/restaurant" element={<Restaurant />} />
                <Route path="/restaurants" element={<Restaurant />} />
                <Route path="/city/delhi/:id" element={<RestaurantMenu />} />
                <Route path="/city/delhi/:id/search" element={<SearchFood />} />
              </Route>
              <Route path="/Checkout" element={<Checkout />} />
            </Routes>
          </main>
          <Fotter />
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
