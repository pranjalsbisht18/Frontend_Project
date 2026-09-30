import { useSelector } from "react-redux"
import { Link } from "react-router";

export default function RestHeader(){
    const counter = useSelector((state) => state.cartslice.count);

    return (
        <header className="sticky top-0 z-30 border-b border-orange-100 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex w-[92%] max-w-6xl items-center justify-between py-3 sm:py-4">
                <Link to="/" className="group flex items-center gap-2.5" aria-label="Swiggy home">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-xl font-black italic text-white shadow-sm transition group-hover:rotate-[-6deg]">
                        S
                    </span>
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
                        Swiggy<span className="text-orange-500">.</span>
                    </span>
                </Link>

                <nav className="flex items-center gap-2 sm:gap-5">
                    <Link
                        to="/restaurants"
                        className="hidden rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-600 sm:inline-flex"
                    >
                        Restaurants
                    </Link>
                    <Link
                        to="/Checkout"
                        aria-label={`Cart with ${counter} items`}
                        className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-200 sm:px-5"
                    >
                        <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                            <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                            <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                        </svg>
                        <span>Cart</span>
                        <span className="flex min-w-6 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-xs font-extrabold text-orange-600">
                            {counter}
                        </span>
                    </Link>
                </nav>
            </div>
        </header>
    )
}