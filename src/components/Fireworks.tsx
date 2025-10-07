"use client";
import { motion } from "framer-motion";

export default function Fireworks() {
    return (
        <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2 }}
        >
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-yellow-400 rounded-full"
                        style={{
                            width: 10,
                            height: 10,
                            top: "50%",
                            left: "50%",
                        }}
                        animate={{
                            x: [0, (Math.random() - 0.5) * 400],
                            y: [0, (Math.random() - 0.5) * 400],
                            opacity: [1, 0],
                            scale: [1, 3, 0],
                        }}
                        transition={{
                            duration: 1.5,
                            ease: "easeOut",
                            delay: Math.random() * 0.3,
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}
