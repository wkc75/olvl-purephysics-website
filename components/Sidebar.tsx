"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();

    // Auto-open if user is on measurement pages
    const shouldBeOpen = pathname.startsWith("/physics/measurements");

    const [open, setOpen] = useState(shouldBeOpen);

    // keep sidebar in sync when route changes
    useEffect(() => {
        setOpen(shouldBeOpen);
    }, [shouldBeOpen]);

    return (
        <aside className="w-64 bg-slate-900 text-white p-4">
            {/* home link */}
            <Link href = "/" className="text-2xl font-bold mb-6 block hover:underline">
                GCE A Level Physics Interactive Guide
            </Link>

        <nav className="text-sm">
            {/* Measurements section */}
            {/* button */}
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 w-full font-semibold hover:underline"
            >
                <ChevronRight
                    className={`transition-transform duration-300 ${
                        open ? "rotate-90" : ""
                    }`}
                    size={16}
                />
                <Link href="/physics/measurements/learning_outcomes" className="flex-1 text-left">
                    1. Quantities and Measurements
                </Link>
            </button>

            {/* Animated Subsection Container */}
            <div
                className={`ml-6 overflow-hidden transition-all duration-300 ${
                    open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
                <Link 
                    href="/physics/measurements/physical-quantities-prefixes"
                    className={`block mt-2 hover:underline ${
                        pathname.includes("physical-quantities-prefixes")
                            ? "text-white font-semibold"
                            : "text-slate-300"
                    }`}
                >
                    1.1 Physical Quantities and Prefixes
                </Link>
                <Link 
                    href="/physics/measurements/errors-and-uncertainties"
                    className={`block mt-2 hover:underline ${
                        pathname.includes("errors-and-uncertainties")
                            ? "text-white font-semibold"
                            : "text-slate-300"
                    }`}
                >
                    1.2 Errors and Uncertainties
                </Link>
                <Link 
                    href="/physics/measurements/scalar-and-vector"
                    className={`block mt-2 hover:underline ${
                        pathname.includes("scalar-and-vector")
                            ? "text-white font-semibold"
                            : "text-slate-300"
                    }`}
                >
                    1.3 Scalar and Vector Quantities
                </Link>
            </div>
        </nav>
        </aside>)}