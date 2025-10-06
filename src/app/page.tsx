"use client";
import { motion } from "framer-motion";
import Tilt from "react-parallax-tilt";
import { Button } from "@mui/material";
import Link from "next/link";
import CelebrationIcon from "@mui/icons-material/Celebration";
import FireworksIcon from "@mui/icons-material/Whatshot";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function Home() {
    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gradient-to-br from-amber-600 via-orange-700 to-rose-800 px-4">
            {/* Floating festive glow background */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        "radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)",
                        "radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                    repeatType: "mirror",
                }}
            />

            {/* Fireworks animation */}
            <motion.div
                className="absolute top-0 left-0 right-0 flex justify-center mt-8 pointer-events-none"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                }}
            >
                <FireworksIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                <FireworksIcon
                    sx={{ fontSize: 50, color: "#FF6347", marginLeft: 8 }}
                />
                <FireworksIcon
                    sx={{ fontSize: 40, color: "#FF4500", marginLeft: 8 }}
                />
            </motion.div>

            {/* Title */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-4 mt-12"
            >
                <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                <h1 className="text-4xl font-extrabold tracking-wide text-center">
                    Diwali Tambola
                </h1>
                <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
            </motion.div>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-center text-lg mb-10 text-amber-100 max-w-xs"
            >
                Light up your game night with a festive twist on Tambola — 99
                Diwali names, unlimited fun!
            </motion.p>

            {/* Tilt buttons section */}
            <Tilt glareEnable={true} glareMaxOpacity={0.3} scale={1.05}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="flex flex-col gap-4 w-full max-w-xs"
                >
                    <Link href="/create" className="w-full">
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<AddCircleOutlineIcon />}
                            className="!bg-yellow-300 !text-rose-900 !font-bold !py-3 !rounded-xl !shadow-lg hover:!bg-yellow-400"
                        >
                            Create Game
                        </Button>
                    </Link>

                    <Link href="/join" className="w-full">
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<GroupAddIcon />}
                            className="!border-yellow-300 !text-yellow-200 !font-bold !py-3 !rounded-xl hover:!bg-yellow-300 hover:!text-rose-900"
                        >
                            Join Game
                        </Button>
                    </Link>

                    {/* Admin Login Button */}
                    <Link href="/login" className="w-full">
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<AdminPanelSettingsIcon />}
                            className="!border-yellow-400 !text-yellow-200 !font-semibold !py-3 !rounded-xl hover:!bg-yellow-400 hover:!text-rose-900 transition-all"
                        >
                            Admin Login
                        </Button>
                    </Link>
                </motion.div>
            </Tilt>

            {/* Floating footer text */}
            <motion.div
                className="absolute bottom-12 text-sm text-amber-200 flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🪔 Let the Festival of Lights Begin!
            </motion.div>
        </main>
    );
}
