"use client";

import { motion } from "framer-motion";

export default function Loader() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#fff8e7] z-50">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-20 h-20 rounded-full border-8 border-amber-400 border-t-transparent shadow-lg"
            />
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-6 text-3xl text-amber-700 font-semibold"
            >
                🪔 Lighting Diyas...
            </motion.div>
        </div>
    );
}
