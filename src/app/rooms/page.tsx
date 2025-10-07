"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button } from "@mui/material";
import Link from "next/link";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HomeIcon from "@mui/icons-material/Home";
import { fetchWrapper } from "@/utils/fetch"; // adjust if your util path differs

export default function MyRoomsPage() {
    const [rooms, setRooms] = useState<any[]>([]);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const loadRooms = async () => {
            try {
                const res = await fetchWrapper({
                    url: `/rooms/host/${localStorage.getItem("playerName")}`,
                    method: "GET",
                });
                const result = await res.json();
                setRooms(result);
            } catch (err) {
                console.error(err);
            }
        };
        loadRooms();
        setUsername(localStorage.getItem("playerName"));
    }, []);

    return (
        <main className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-white bg-gradient-to-br from-amber-600 via-orange-700 to-rose-800 px-4 py-10">
            {/* Floating festive background */}
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

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex items-center gap-3 mb-6 mt-8"
            >
                <CelebrationIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                <h1 className="text-3xl font-extrabold tracking-wide text-center">
                    My Tambola Rooms
                </h1>
                <CelebrationIcon sx={{ fontSize: 36, color: "#FFD700" }} />
            </motion.div>

            {/* Room list */}
            <div className="w-full max-w-md flex flex-col gap-5 z-10">
                {rooms.length === 0 ? (
                    <p className="text-center text-amber-100">
                        🎲 No rooms found for {username}.
                    </p>
                ) : (
                    rooms.map((room: any) => (
                        <motion.div
                            key={room._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card
                                className={`!rounded-2xl !shadow-lg ${
                                    room.isHost
                                        ? "!bg-gradient-to-r from-yellow-300 to-orange-400"
                                        : "!bg-gradient-to-r from-rose-400 to-amber-400"
                                } !text-rose-900`}
                            >
                                <CardContent className="flex flex-col gap-3">
                                    <Typography
                                        variant="h6"
                                        className="font-bold flex items-center gap-2"
                                    >
                                        {room.isHost ? (
                                            <EmojiEventsIcon
                                                sx={{ color: "#b45309" }}
                                            />
                                        ) : (
                                            <HomeIcon
                                                sx={{ color: "#9d174d" }}
                                            />
                                        )}
                                        {room.isHost
                                            ? "Hosted Room"
                                            : "Joined Room"}
                                    </Typography>

                                    <Typography>
                                        👤 <b>{room.name}</b>
                                    </Typography>

                                    {room.roomCode && (
                                        <Typography>
                                            🔢 Room Code: <b>{room.roomCode}</b>
                                        </Typography>
                                    )}

                                    {room.isHost && room.roomCode && (
                                        <Link
                                            href={`/room/${room.roomCode}`}
                                            className="w-full"
                                        >
                                            <Button
                                                variant="contained"
                                                fullWidth
                                                className="!bg-rose-700 !text-yellow-200 !font-bold hover:!bg-rose-800"
                                            >
                                                Open Room
                                            </Button>
                                        </Link>
                                    )}
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

            {/* Floating footer */}
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
