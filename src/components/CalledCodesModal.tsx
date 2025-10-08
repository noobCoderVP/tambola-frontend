"use client";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

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
        <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-50">
            <div className="relative bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 max-h-[70vh] overflow-y-auto text-yellow-200 shadow-lg scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-rose-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                {/* ❌ Close Icon Button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-yellow-300 hover:text-yellow-100 transition"
                >
                    <CloseIcon fontSize="small" />
                </button>

                {/* Title */}
                <h2 className="text-lg font-bold mb-3 text-center">
                    🪔 Called Codes
                </h2>

                {/* 🔍 Search Input */}
                <input
                    type="text"
                    placeholder="Search code..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-rose-800 border border-yellow-400 text-yellow-100 placeholder-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                />

                {/* 📜 Code List */}
                <ul className="space-y-1 text-sm pr-2">
                    {filtered.length > 0 ? (
                        filtered.map((c, i) => (
                            <li
                                key={i}
                                id={`code-${i}`}
                                className="hover:bg-yellow-300/10 px-2 py-1 rounded transition"
                            >
                                {i + 1} – {c}
                            </li>
                        ))
                    ) : (
                        <li className="text-yellow-300 italic">
                            No codes found.
                        </li>
                    )}
                </ul>

                {/* ✅ Bottom Close Button */}
                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400 active:scale-95 transition"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
