"use client";
import { motion } from "framer-motion";

export default function CodeLoader() {
    return (
        <div className="flex flex-col items-center justify-center mt-10">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="w-16 h-16 rounded-full border-8 border-yellow-400 border-t-transparent"
            ></motion.div>

            <motion.p
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-yellow-200 mt-4 text-lg font-semibold"
            >
                🪔 Calling next code...
            </motion.p>
        </div>
    );
}
