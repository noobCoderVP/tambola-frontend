"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { fetchWrapper } from "@/utils/fetch";
import { useParams } from "next/navigation";

export default function HostRoomPage() {
    const params: any = useParams();
    const roomCode = params.code?.toUpperCase() || "";

    const [calledCodes, setCalledCodes] = useState<string[]>([]);
    const [lastCalled, setLastCalled] = useState<string | null>(null);
    const [message, setMessage] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch history once when page loads
    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${roomCode}/history`,
                method: "GET",
            });
            const data = await res.json();
            setCalledCodes(data.calledCodes || []);
        } catch {
            setMessage("⚠️ Failed to load history.");
        }
    };

    const callRandomCode = async () => {
        setLoading(true);
        try {
            const res = await fetchWrapper({
                url: `/rooms/${roomCode}/call`,
                method: "POST",
            });
            const data = await res.json();
            if (res.ok && data.item) {
                setLastCalled(data.item);
                setCalledCodes((prev) => [...prev, data.item]);
                setMessage(`🪔 Called: ${data.item}`);
            } else {
                setMessage(data.message || "No more codes left!");
            }
        } catch {
            setMessage("⚠️ Error calling code.");
        } finally {
            setLoading(false);
        }
    };

    const closeRoom = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${roomCode}/close`,
                method: "POST",
            });
            if (res.ok) {
                alert("Room closed successfully!");
                window.location.href = "/";
            } else setMessage("⚠️ Failed to close room.");
        } catch {
            setMessage("⚠️ Room close failed.");
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
                        Host Room – Diwali Tambola
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    Room Code: <span className="font-bold">{roomCode}</span>
                </p>
            </motion.div>

            {/* Big Random Call Button */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={callRandomCode}
                disabled={loading}
                className="relative bg-yellow-300 text-rose-900 font-extrabold py-6 px-10 rounded-full text-2xl shadow-[0_0_20px_rgba(255,215,0,0.8)] hover:shadow-[0_0_35px_rgba(255,215,0,1)] hover:bg-yellow-400 active:scale-95 transition-all"
            >
                {loading ? "Calling..." : "🎆 CALL RANDOM CODE 🎆"}
                <motion.span
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full border-4 border-yellow-400 opacity-30"
                ></motion.span>
            </motion.button>

            {/* Last Called */}
            {lastCalled && (
                <motion.div
                    key={lastCalled}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 text-center"
                >
                    <p className="text-yellow-100 text-lg">Last Called:</p>
                    <p className="text-5xl font-extrabold text-yellow-300 tracking-widest mt-2 drop-shadow-lg">
                        {lastCalled}
                    </p>
                </motion.div>
            )}

            {/* Buttons Section */}
            <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
                <button
                    onClick={() => setShowHistory(true)}
                    className="flex items-center justify-center gap-2 bg-transparent border border-yellow-400 text-yellow-200 py-3 rounded-xl hover:bg-yellow-400 hover:text-rose-900 transition"
                >
                    <HistoryIcon /> View Called Names
                </button>

                <button
                    onClick={() => setConfirmClose(true)}
                    className="flex items-center justify-center gap-2 bg-rose-800 text-yellow-100 font-bold py-3 rounded-xl hover:bg-rose-700 border border-yellow-400 transition"
                >
                    <CloseIcon /> Close Room
                </button>
            </div>

            {message && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-center text-sm text-yellow-100"
                >
                    {message}
                </motion.p>
            )}

            {/* History Modal */}
            {showHistory && (
                <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
                    <div className="bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 max-h-[70vh] overflow-y-auto text-yellow-200 shadow-lg">
                        <h2 className="text-lg font-bold mb-3 text-center">
                            🪔 Called Codes
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

            {/* Confirmation Modal */}
            {confirmClose && (
                <div className="absolute inset-0 bg-black/70 flex justify-center items-center">
                    <div className="bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 text-center text-yellow-200 shadow-lg">
                        <h3 className="font-bold text-lg mb-3">
                            Are you sure you want to close this room?
                        </h3>
                        <div className="flex justify-between gap-3">
                            <button
                                onClick={closeRoom}
                                className="flex-1 bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400"
                            >
                                Yes, Close
                            </button>
                            <button
                                onClick={() => setConfirmClose(false)}
                                className="flex-1 bg-transparent border border-yellow-400 text-yellow-100 py-2 rounded-lg hover:bg-yellow-400 hover:text-rose-900"
                            >
                                Cancel
                            </button>
                        </div>
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

            {/* Floating footer animation */}
            <motion.div
                className="absolute bottom-8 text-sm text-yellow-100"
                animate={{ y: [0, -5, 0] }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                🎇 Let the Diwali Luck Decide the Next Code!
            </motion.div>
        </main>
    );
}
