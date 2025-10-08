"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import { useParams } from "next/navigation";
import { fetchWrapper } from "@/utils/fetch";
import { ArrowBack } from "@mui/icons-material";
import FireworksBackground from "@/components/FireworksBackground";

type LeaderboardEntry = {
    username: string;
    claimType: string;
    _id: string;
    claimedAt: string;
};

export default function LeaderboardPage() {
    const params: any = useParams();
    const code = params.code?.toUpperCase() || "";
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/leaderboard`,
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                setLeaderboard(data || []);
            } else {
                setMessage("⚠️ Failed to load leaderboard.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Error loading leaderboard.");
        }
    };

    const formatTime = (iso: string) => {
        const date = new Date(iso);
        return date.toLocaleTimeString("en-IN", {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
            <FireworksBackground />

            {/* Back button */}
            <button
                onClick={() => window.history.back()}
                className="absolute top-5 left-5 flex items-center gap-1 text-yellow-200 hover:text-yellow-400 transition"
            >
                <ArrowBack fontSize="small" /> Back
            </button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center mt-12 mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <EmojiEventsIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Room Leaderboard
                    </h1>
                    <EmojiEventsIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    🪔 Room Code: <span className="font-bold">{code}</span>
                </p>
            </motion.div>

            {/* Leaderboard Table */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md w-full max-w-md border border-yellow-400/40 overflow-x-auto"
            >
                {leaderboard.length > 0 ? (
                    <table className="w-full text-yellow-100 text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-yellow-400/40 text-yellow-300">
                                <th className="py-2 text-left">Rank</th>
                                <th className="py-2 text-left">Username</th>
                                <th className="py-2 text-left">Claim Type</th>
                                <th className="py-2 text-left">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <motion.tr
                                    key={entry._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-yellow-400/20 hover:bg-yellow-300/10 transition"
                                >
                                    <td className="py-2 font-bold text-yellow-200">
                                        #{index + 1}
                                    </td>
                                    <td className="py-2">{entry.username}</td>
                                    <td className="py-2">{entry.claimType}</td>
                                    <td className="py-2">
                                        {formatTime(entry.claimedAt)}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center text-yellow-200">
                        {message || "No claims yet!"}
                    </p>
                )}
            </motion.div>

            {/* Footer hint */}
            <div className="mt-4 flex items-center gap-2 text-yellow-200 text-sm">
                <HistoryIcon fontSize="small" /> Updated in real-time
            </div>
        </main>
    );
}
