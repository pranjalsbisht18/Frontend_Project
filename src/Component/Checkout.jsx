import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router"
import RestHeader from "./RestHeader"
import { DecrementItems, IncrementItems } from "../Stored/CartSlicer"

export default function Checkout(){
    const dispatch = useDispatch();
    const items = useSelector((state) => state.cartslice.items);
    const itemCount = useSelector((state) => state.cartslice.count);
    const subtotal = items.reduce((total, item) => {
        const price = item.defaultPrice ?? item.price ?? 0;
        return total + (price / 100) * item.quantity;
    }, 0);

    const formatPrice = (amount) => new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

    return(
        <>
            <RestHeader />
            <main className="mx-auto min-h-[65vh] w-[92%] max-w-6xl py-8 sm:py-12">
                <div className="mb-8">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Your order</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Your cart</h1>
                    <p className="mt-2 text-gray-500">
                        {itemCount} {itemCount === 1 ? "item" : "items"} selected
                    </p>
                </div>

                {items.length === 0 ? (
                    <section className="mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-orange-100 bg-white px-6 py-12 text-center shadow-sm sm:py-16">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                            <svg aria-hidden="true" className="h-12 w-12" viewBox="0 0 24 24" fill="none">
                                <path d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.4L22 8H6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="10" cy="20" r="1.5" fill="currentColor" />
                                <circle cx="18" cy="20" r="1.5" fill="currentColor" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">Your cart is looking a little empty</h2>
                        <p className="mt-2 max-w-sm text-gray-500">Add something delicious and it will show up here.</p>
                        <Link
                            to="/restaurants"
                            className="mt-7 rounded-full bg-orange-500 px-7 py-3 font-bold text-white shadow-md shadow-orange-200 transition hover:-translate-y-0.5 hover:bg-orange-600"
                        >
                            Explore restaurants
                        </Link>
                    </section>
                ) : (
                    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
                                <h2 className="font-bold text-gray-900">Order items</h2>
                                <Link to="/restaurants" className="text-sm font-bold text-orange-600 hover:text-orange-700">
                                    + Add more
                                </Link>
                            </div>
                            <ul className="divide-y divide-gray-100 px-5 sm:px-7">
                                {items.map((item) => {
                                    const unitPrice = (item.defaultPrice ?? item.price ?? 0) / 100;
                                    return (
                                        <li className="flex items-center gap-4 py-5 sm:gap-5" key={item.id}>
                                            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-green-200">
                                                <span className="h-3 w-3 rounded-full bg-green-600" />
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="truncate font-semibold text-gray-800">{item.name}</h3>
                                                <p className="mt-1 text-sm text-gray-500">{formatPrice(unitPrice)} each</p>
                                            </div>
                                            <div className="inline-flex shrink-0 items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                                                <button
                                                    className="h-9 w-9 font-bold text-gray-600 transition hover:text-orange-600"
                                                    onClick={() => dispatch(DecrementItems(item))}
                                                    aria-label={`Remove one ${item.name}`}
                                                >
                                                    −
                                                </button>
                                                <span className="min-w-6 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                                                <button
                                                    className="h-9 w-9 font-bold text-gray-600 transition hover:text-orange-600"
                                                    onClick={() => dispatch(IncrementItems(item))}
                                                    aria-label={`Add one ${item.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="w-20 shrink-0 text-right text-sm font-bold text-gray-900">
                                                {formatPrice(unitPrice * item.quantity)}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </section>

                        <aside className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7 lg:sticky lg:top-24">
                            <h2 className="text-lg font-bold text-gray-900">Bill details</h2>
                            <div className="mt-5 space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Item total</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery fee</span>
                                    <span className="text-green-700">Calculated at checkout</span>
                                </div>
                            </div>
                            <div className="my-5 border-t border-dashed border-gray-200" />
                            <div className="flex items-center justify-between text-base font-extrabold text-gray-900">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-gray-500">Delivery fees and taxes may vary by restaurant.</p>
                            <button
                                type="button"
                                disabled
                                className="mt-6 w-full cursor-not-allowed rounded-2xl bg-gray-200 px-5 py-3.5 font-bold text-gray-500"
                                title="Online checkout is not available yet"
                            >
                                Checkout coming soon
                            </button>
                            <Link to="/restaurants" className="mt-4 block text-center text-sm font-bold text-orange-600 hover:text-orange-700">
                                Continue browsing
                            </Link>
                        </aside>
                    </div>
                )}
            </main>
        </>
    )
}