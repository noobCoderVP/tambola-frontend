"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Link from "next/link";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HomeIcon from "@mui/icons-material/Home";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { fetchWrapper } from "@/utils/fetch";
import { useRouter } from "next/navigation";

export default function MyRoomsPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const user = localStorage.getItem("username");
        if (!user) {
            router.replace("/user/login");
            return;
        }

        setUsername(user);

        const loadRooms = async () => {
            try {
                const res = await fetchWrapper({
                    url: `/rooms/host/${user}`,
                    method: "GET",
                });
                const result = await res.json();
                if (res.ok) setRooms(result);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadRooms();
    }, [router]);

    if (loading) {
        return (
            <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-600 via-orange-700 to-rose-800 text-white">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        repeatType: "mirror",
                    }}
                    className="text-lg font-semibold"
                >
                    🪔 Loading your rooms...
                </motion.div>
            </main>
        );
    }

    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gradient-to-br from-amber-600 via-orange-700 to-rose-800 px-4 py-10">
            {/* Background animation */}
            <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                    background: [
                        "radial-gradient(circle at 10% 20%, rgba(255,255,255,0.2) 0%, transparent 60%)",
                        "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0%, transparent 60%)",
                    ],
                }}
                transition={{
                    repeat: Infinity,
                    duration: 5,
                    ease: "easeInOut",
                    repeatType: "mirror",
                }}
            />

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-6 mt-8"
            >
                <CelebrationIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                <h1 className="text-3xl font-extrabold tracking-wide text-center">
                    My Housey Rooms
                </h1>
                <CelebrationIcon sx={{ fontSize: 36, color: "#FFD700" }} />
            </motion.div>

            {/* Room List */}
            <div className="w-full max-w-md flex flex-col gap-4 z-10">
                {rooms.length === 0 ? (
                    <p className="text-center text-amber-100">
                        🎲 No rooms found for {username}.
                    </p>
                ) : (
                    rooms.map((room) => (
                        <motion.div
                            key={room._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Card
                                onClick={() =>
                                    router.push(
                                        room.host == localStorage.getItem("username")
                                            ? `/room/host/${room.code}`
                                            : `/room/player/${room.code}`
                                    )
                                }
                                className={`!rounded-xl !shadow-md !border !border-yellow-300/30 cursor-pointer hover:!scale-[1.02] transition-transform duration-200 ${
                                    room.isHost
                                        ? "!bg-gradient-to-r from-yellow-200 to-orange-300"
                                        : "!bg-gradient-to-r from-rose-300 to-amber-300"
                                }`}
                            >
                                <CardContent className="flex items-center justify-between !py-3 !px-4 text-rose-900 font-semibold">
                                    {/* Left side */}
                                    <div className="flex items-center gap-2">
                                        {room.host == localStorage.getItem("username") ? (
                                            <EmojiEventsIcon
                                                sx={{
                                                    fontSize: 22,
                                                    color: "#92400e",
                                                }}
                                            />
                                        ) : (
                                            <HomeIcon
                                                sx={{
                                                    fontSize: 22,
                                                    color: "#9d174d",
                                                }}
                                            />
                                        )}
                                        <span>
                                            {room.code
                                                ? room.code
                                                : "No Code"}
                                        </span>
                                    </div>

                                    {/* Right side: label */}
                                    <span className="text-sm px-3 py-1 rounded-full bg-white/60 text-rose-900 font-bold">
                                        {room.host == localStorage.getItem("username") ? "Host" : "Player"}
                                    </span>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Back button */}
            <Link href="/" className="mt-10">
                <Button
                    variant="outlined"
                    className="!border-yellow-300 !text-yellow-200 !rounded-xl hover:!bg-yellow-300 hover:!text-rose-900"
                >
                    ⬅ Back to Home
                </Button>
            </Link>

            {/* Footer */}
            <motion.div
                className="absolute bottom-10 text-sm text-amber-200 flex items-center gap-2"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🪔 Keep the lights shining bright!
            </motion.div>
        </main>
    );
}
