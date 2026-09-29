import { Link } from "react-router";

export default function Fotter() {
  return (
    <footer className="mt-20 bg-gray-100 px-6 py-12 text-gray-600">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="text-3xl font-bold text-orange-600">
            Swiggy
          </Link>
          <p className="mt-3">Good food, delivered to your door.</p>
          <p className="mt-1 text-sm">© 2026 Swiggy</p>
        </div>

        <div>
          <h2 className="mb-3 font-bold text-gray-900">Explore</h2>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-600">Home</Link></li>
            <li><Link to="/restaurants" className="hover:text-orange-600">Restaurants</Link></li>
            <li><a href="https://www.swiggy.com/instamart" className="hover:text-orange-600">Instamart</a></li>
            <li><a href="https://www.swiggy.com/dineout" className="hover:text-orange-600">Dineout</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-bold text-gray-900">Help</h2>
          <ul className="space-y-2">
            <li><a href="https://www.swiggy.com/support" className="hover:text-orange-600">Help and Support</a></li>
            <li><a href="https://www.swiggy.com/corporate/" className="hover:text-orange-600">About Swiggy</a></li>
            <li><a href="https://partner.swiggy.com/login#/swiggy" className="hover:text-orange-600">Partner with us</a></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-bold text-gray-900">Follow us</h2>
          <ul className="space-y-2">
            <li><a href="https://www.instagram.com/swiggyindia/" className="hover:text-orange-600">Instagram</a></li>
            <li><a href="https://www.linkedin.com/company/swiggy-in/" className="hover:text-orange-600">LinkedIn</a></li>
            <li><a href="https://www.facebook.com/swiggy.in/" className="hover:text-orange-600">Facebook</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
