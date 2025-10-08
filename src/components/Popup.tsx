"use client";
import { motion, AnimatePresence } from "framer-motion";

export default function Popup({
    message,
    onClose,
    duration = 2500,
}: {
    message: string;
    onClose: () => void;
    duration?: number;
}) {
    // Auto close after duration
    if (message) {
        setTimeout(() => {
            onClose();
        }, duration);
    }

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        className="bg-yellow-200 text-rose-900 font-bold text-center px-6 py-4 rounded-2xl shadow-xl border-2 border-yellow-400 max-w-xs"
                    >
                        {message}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
