"use client";
import { useState } from "react";

export default function CalledCodesModal({
    calledCodes,
    onClose,
}: {
    calledCodes: string[];
    onClose: () => void;
}) {
    const [search, setSearch] = useState("");

    const filtered = calledCodes.filter((c) =>
        c.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
            <div className="bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 max-h-[70vh] overflow-y-auto text-yellow-200 shadow-lg">
                <h2 className="text-lg font-bold mb-3 text-center">
                    🪔 Called Codes
                </h2>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-rose-800 border border-yellow-400 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />

                {/* List */}
                <ul className="space-y-1 text-sm">
                    {filtered.length > 0 ? (
                        filtered.map((c, i) => (
                            <li key={i} id={`code-${i}`}>
                                {i + 1} - {c}
                            </li>
                        ))
                    ) : (
                        <li>No codes found.</li>
                    )}
                </ul>

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
