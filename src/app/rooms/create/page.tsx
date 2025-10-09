"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { fetchWrapper } from "@/utils/fetch";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";

/* --------------------------------------------
   🔹 Main Component
--------------------------------------------- */
export default function CreateRoomPage() {
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // ✅ Redirect if user not logged in
    useEffect(() => {
        const username = localStorage.getItem("username");
        if (!username) router.push("/user/login");
    }, [router]);

    /* --------------------------------------------
       🔹 Room Creation Handler
    --------------------------------------------- */
    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await fetchWrapper({
                url: "/rooms",
                method: "POST",
                data: {
                    host: localStorage.getItem("username"),
                    code: code?.trim().toUpperCase() || null,
                    password: password?.trim().toUpperCase() || null,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`🎉 Room created successfully! Code: ${data.code}`);
                router.push(`/room/host/${data.code}`);
            } else {
                setMessage(`❌ ${data.message || "Failed to create room."}`);
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    /* --------------------------------------------
       🔹 JSX Markup
    --------------------------------------------- */
    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
            {/* Header */}
            <header>
                <motion.div
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex items-center gap-3 mb-8 mt-10"
                >
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Create Diwali Housie Room
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </motion.div>

                {/* Back Button */}
                <Link href="/" className="absolute top-5 left-5">
                    <button
                        type="button"
                        className="flex items-center gap-1 border border-yellow-400 text-yellow-300 text-sm px-3 py-1.5 rounded-md hover:bg-yellow-300 hover:text-rose-900 transition"
                    >
                        <ArrowBackIcon fontSize="small" /> Home
                    </button>
                </Link>
            </header>

            {/* Form */}
            <motion.form
                onSubmit={handleCreateRoom}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col gap-4 w-full max-w-sm border border-yellow-400/40"
            >
                <InputField
                    id="roomCode"
                    label="Room Code"
                    value={code}
                    onChange={setCode}
                    placeholder="E.g. DIWALI23"
                />

                <InputField
                    id="roomPassword"
                    label="Room Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter room password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition active:scale-95 disabled:opacity-70"
                >
                    {loading ? "Creating..." : "Create Room 🎉"}
                </button>

                {message && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm mt-2 text-yellow-200"
                    >
                        {message}
                    </motion.p>
                )}
            </motion.form>

            {/* Footer Text */}
            <motion.div
                className="absolute bottom-10 text-sm text-yellow-100"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🪔 Let’s Start the Festive Fun!
            </motion.div>
        </main>
    );
}
