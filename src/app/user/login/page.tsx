"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchWrapper } from "@/utils/fetch";
import InputField from "@/components/InputField";

/* --------------------------------------------
   🔹 User Login Page
--------------------------------------------- */
export default function UserLoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    /* --------------------------------------------
       🔹 Handle Login
    --------------------------------------------- */
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetchWrapper({
                url: "/users/login",
                method: "POST",
                data: {
                    username: username.toUpperCase().trim(),
                    password,
                },
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                setMessage(`✅ Welcome back, ${username.toUpperCase()}!`);
                localStorage.setItem("username", data.username.toUpperCase());

                setTimeout(() => {
                    router.push("/rooms");
                }, 1200);
            } else {
                setMessage(
                    `❌ ${data.message || "Invalid username or password."}`
                );
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Something went wrong. Please try again.");
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
                        User Login – Diwali Housie
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

            {/* Login Form */}
            <motion.form
                onSubmit={handleLogin}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col gap-4 w-full max-w-sm border border-yellow-400/40"
            >
                <InputField
                    id="username"
                    label="Username"
                    value={username}
                    onChange={(val) => setUsername(val.toUpperCase())}
                    placeholder="Enter your username"
                />

                <InputField
                    id="password"
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(val) => setPassword(val)}
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition active:scale-95 disabled:opacity-70"
                >
                    {loading ? "Logging in..." : "Login 🎟️"}
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

            {/* Footer */}
            <motion.div
                className="absolute bottom-10 text-sm text-yellow-100"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🪔 Log in and join the festive fun!
            </motion.div>
        </main>
    );
}
