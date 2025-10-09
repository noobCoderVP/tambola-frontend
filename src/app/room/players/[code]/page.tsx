"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import { fetchWrapper } from "@/utils/fetch";
import { ArrowBack, DeleteForever } from "@mui/icons-material";
import PeopleIcon from "@mui/icons-material/People";
import FireworksBackground from "@/components/FireworksBackground";

export default function PlayersPage() {
    const params: any = useParams();
    const code = params.code?.toUpperCase() || "";
    const [players, setPlayers] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);

    const host =
        typeof window !== "undefined" ? localStorage.getItem("username") : "";

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/players`,
                method: "GET",
            });
            const data = await res.json();
            if (res.ok) {
                setPlayers(data || []);
                setMessage("");
            } else {
                setMessage(data?.message || "⚠️ Failed to load players.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Error loading players.");
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (player: string) => {
        if (!confirm(`Remove ${player} from this room?`)) return;
        setRemoving(player);
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/remove-player`,
                method: "POST",
                data: { player, host },
            });
            const data = await res.json();
            if (res.ok) {
                setPlayers((prev) => prev.filter((p) => p !== player));
            } else {
                alert(data?.message || "Failed to remove player");
            }
        } catch (err) {
            console.error(err);
            alert("Error removing player");
        } finally {
            setRemoving(null);
        }
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
                    <PeopleIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Players in Room
                    </h1>
                    <PeopleIcon sx={{ fontSize: 36, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    🪔 Room Code: <span className="font-bold">{code}</span>
                </p>
            </motion.div>

            {/* Players Grid */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md w-full max-w-md border border-yellow-400/40"
            >
                {loading ? (
                    <p className="text-center text-yellow-200 animate-pulse">
                        Loading players...
                    </p>
                ) : players.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                        {players.map((player, index) => (
                            <motion.div
                                key={player}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2 hover:bg-yellow-400/20 transition"
                            >
                                <span className="font-medium truncate">
                                    {player}
                                </span>
                                {host && (
                                    <button
                                        disabled={removing === player}
                                        onClick={() => handleRemove(player)}
                                        className="text-amber-300 hover:text-yellow-400 disabled:opacity-50 transition"
                                    >
                                        <DeleteForever fontSize="small" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-yellow-200">
                        {message || "No players yet!"}
                    </p>
                )}
            </motion.div>

            {/* Footer hint */}
            <div className="mt-4 flex items-center gap-2 text-yellow-200 text-sm">
                <PeopleIcon sx={{ fontSize: 18, color: "#FFE066" }} />
                Total Players: {players.length}
            </div>
        </main>
    );
}
