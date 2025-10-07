"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { fetchWrapper } from "@/utils/fetch";
import TicketGrid from "@/components/TicketGrid";
import { useParams } from "next/navigation";

export default function RoomPage() {
    const params: any = useParams();
    const roomCode = params.code?.toUpperCase() || "";
    const [playerName, setPlayerName] = useState<string>("");
    const [ticket, setTicket] = useState<string[][] | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [markedItems, setMarkedItems] = useState<string[]>([]);
    const [markedCount, setMarkedCount] = useState(0);
    const [calledCodes, setCalledCodes] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const storedName = localStorage.getItem("playerName");
        if (storedName) setPlayerName(storedName);
        fetchTicket();
    }, []);

    const parseTicketString = (ticketString: string): string[][] => {
        return ticketString.split("\\").map((row) => row.split(","));
    };

    const fetchTicket = async () => {
        try {
            const res = await fetchWrapper({
                url: `/tickets?user=${localStorage.getItem(
                    "playerName"
                )}&roomCode=${roomCode}`,
                method: "GET",
            });
            if (res.ok) {
                const data = await res.json();
                if (data?.ticketString) {
                    setTicket(parseTicketString(data.ticketString));
                    setMarkedItems(data.markedItems || []);
                    setMarkedCount(data.markedItems?.length || 0);
                    setTicketId(data._id);
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const generateTicket = async () => {
        setLoading(true);
        try {
            const res = await fetchWrapper({
                url: `/tickets`,
                method: "POST",
                data: { user: playerName, roomCode },
            });
            const data = await res.json();
            if (res.ok && data.ticketString) {
                setTicket(parseTicketString(data.ticketString));
                setMarkedItems([]);
                setTicketId(data._id);
                setMessage("🎟️ Ticket generated successfully!");
            } else {
                setMessage(data.message || "❌ Failed to generate ticket.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    const handleMark = async (symbol: string) => {
        if (!symbol || !ticketId) return;
        let updatedMarks = [...markedItems];

        if (updatedMarks.includes(symbol)) {
            updatedMarks = updatedMarks.filter((item) => item !== symbol);
        } else {
            updatedMarks.push(symbol);
        }

        setMarkedItems(updatedMarks);
        setMarkedCount(updatedMarks.length);

        // Optional: Update DB (non-blocking)
        fetchWrapper({
            url: `/tickets/${ticketId}/mark`,
            method: "POST",
            data: { markedItems: updatedMarks },
        }).catch((err) => console.error("Mark update failed", err));
    };

    const handleClaim = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${roomCode}/claim`,
                method: "POST",
                data: { playerName },
            });
            const data = await res.json();
            setMessage(data.message || "Claim submitted!");
        } catch (err) {
            setMessage("⚠️ Claim request failed.");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${roomCode}/history`,
                method: "GET",
            });
            const data = await res.json();
            setCalledCodes(data.calledCodes || []);
            setShowHistory(true);
        } catch (err) {
            setMessage("⚠️ Failed to load history.");
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center mt-10 mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Diwali Tambola Room
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    🪔 Welcome <span className="font-bold">{playerName}</span> |
                    Room: <span className="font-bold">{roomCode}</span>
                </p>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col gap-5 w-full max-w-md border border-yellow-400/40"
            >
                {!ticket ? (
                    <button
                        onClick={generateTicket}
                        disabled={loading}
                        className="bg-yellow-300 text-rose-900 font-bold py-3 rounded-xl hover:bg-yellow-400 transition active:scale-95 disabled:opacity-70"
                    >
                        {loading ? "Generating..." : "Generate Ticket 🎟️"}
                    </button>
                ) : (
                    <>
                        <TicketGrid
                            ticket={ticket}
                            markedItems={markedItems}
                            onMark={handleMark}
                        />
                        <div className="flex justify-between items-center mt-3 text-yellow-200 text-sm">
                            <span>⭐ Marked: {markedCount}</span>
                            <button
                                onClick={handleClaim}
                                className="flex items-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                            >
                                <EmojiEventsIcon fontSize="small" /> Claim
                            </button>
                        </div>
                    </>
                )}

                <button
                    onClick={fetchHistory}
                    className="flex items-center gap-2 text-yellow-200 mt-3 hover:text-yellow-400 transition"
                >
                    <HistoryIcon /> View Called Names
                </button>

                {message && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-sm mt-2 text-yellow-100"
                    >
                        {message}
                    </motion.p>
                )}
            </motion.div>

            {/* History Modal */}
            {showHistory && (
                <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
                    <div className="bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 max-h-[70vh] overflow-y-auto text-yellow-200 shadow-lg">
                        <h2 className="text-lg font-bold mb-3 text-center">
                            🪔 Called Names
                        </h2>
                        <ul className="space-y-1 text-sm">
                            {calledCodes.length > 0 ? (
                                calledCodes.map((c, i) => <li key={i}>{c}</li>)
                            ) : (
                                <li>No codes called yet.</li>
                            )}
                        </ul>
                        <button
                            onClick={() => setShowHistory(false)}
                            className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Logout */}
            <button
                onClick={() => {
                    localStorage.clear();
                    window.location.href = "/";
                }}
                className="absolute top-5 right-5 flex items-center gap-1 text-yellow-200 hover:text-yellow-400 transition"
            >
                <LogoutIcon fontSize="small" /> Exit
            </button>

            {/* Floating Footer */}
            <motion.div
                className="absolute bottom-8 text-sm text-yellow-100"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🎇 Let the Diwali Tambola Luck Shine Bright!
            </motion.div>
        </main>
    );
}
