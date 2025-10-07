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
import io from "socket.io-client";
import CalledCodesModal from "@/components/CalledCodesModal"; // ✅ Added
import { ArrowBack } from "@mui/icons-material";
import FireworksBackground from "@/components/FireworksBackground";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
    autoConnect: true,
});

export default function RoomPage() {
    const params: any = useParams();
    const code = params.code?.toUpperCase() || "";
    const [username, setPlayerName] = useState<string>("");
    const [ticketString, setTicketString] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [markedItems, setMarkedItems] = useState<string[]>([]);
    const [markedCount, setMarkedCount] = useState(0);
    const [calledCodes, setCalledCodes] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showClaimOptions, setShowClaimOptions] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [calledPopup, setCalledPopup] = useState<string | null>(null);

    const claimOptions = [
        "First Five",
        "Line Top",
        "Line Middle",
        "Line Bottom",
        "Full House",
    ];

    // ✅ Fetch called codes for modal
    const fetchHistory = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}`,
                method: "GET",
            });
            if (res.ok) {
                const data = await res.json();
                setCalledCodes(data.calledCodes || []);
                setShowHistory(true);
            } else {
                setMessage("⚠️ Failed to load called codes.");
            }
        } catch {
            setMessage("⚠️ Error loading history.");
        }
    };

    // ✅ Claim Handler with Socket Emit
    const handleClaim = async (type: string) => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/verify-claim`,
                method: "POST",
                data: { player: username, type },
            });
            const data = await res.json();

            if (res.ok) {
                setMessage(data.message || "Claim submitted!");
                socket.emit("claim-received", {
                    code,
                    player: username,
                    type,
                });
            } else {
                setMessage(data.message || "❌ Claim failed.");
            }
        } catch (err) {
            console.error(err);
            setMessage("⚠️ Claim request failed.");
        } finally {
            setShowClaimOptions(false);
        }
    };

    useEffect(() => {
        const storedName = localStorage.getItem("username");
        if (storedName) setPlayerName(storedName);
        fetchTicket();

        // Join socket room for live updates
        if (code && storedName) {
            socket.emit("user-joined", { code, username: storedName });
        }

        // 👇 Add these two event listeners:
        socket.on("game-started", () => {
            setMessage("🔥 Game started!");
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 4000);
        });

        socket.on("code-called", (calledCode) => {
            console.log("Code called:", calledCode);
            setCalledPopup(`🎯 Number called: ${calledCode}`);
            setShowFireworks(true);

            setTimeout(() => {
                setCalledPopup(null);
                setShowFireworks(false);
            }, 3000);
        });

        return () => {
            socket.off("game-started");
            socket.off("code-called");
            socket.disconnect();
        };
    }, []);

    const fetchTicket = async () => {
        try {
            const res = await fetchWrapper({
                url: `/tickets?username=${localStorage.getItem(
                    "username"
                )}&code=${code}`,
                method: "GET",
            });
            if (res.ok) {
                const data = await res.json();
                if (data?.ticketString) {
                    setTicketString(data.ticketString);
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
                data: { username, code },
            });
            const data = await res.json();
            if (res.ok && data.ticketString) {
                setTicketString(data.ticketString);
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
        if (markedItems.includes(symbol)) return;

        const updatedMarks = [...markedItems, symbol];
        setMarkedItems(updatedMarks);
        setMarkedCount(updatedMarks.length);

        fetchWrapper({
            url: `/tickets/${ticketId}/mark`,
            method: "PATCH",
            data: { markedItems: updatedMarks },
        }).catch((err) => console.error("Mark update failed", err));
    };

    const handleUnmark = async (symbol: string) => {
        if (!symbol || !ticketId) return;

        const updatedMarks = markedItems.filter((item) => item !== symbol);
        setMarkedItems(updatedMarks);
        setMarkedCount(updatedMarks.length);

        fetchWrapper({
            url: `/tickets/${ticketId}/mark`,
            method: "PATCH",
            data: { markedItems: updatedMarks },
        }).catch((err) => console.error("Unmark update failed", err));
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
            <FireworksBackground />
            {/* Header */}
            {/* Back */}
            <button
                onClick={() => window.history.back()}
                className="absolute top-5 left-5 flex items-center gap-1 text-yellow-200 hover:text-yellow-400 transition"
            >
                <ArrowBack fontSize="small" /> Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center mt-12 mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Diwali Tambola Room
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    🪔 Welcome <span className="font-bold">{username}</span> |
                    Room: <span className="font-bold">{code}</span>
                </p>
            </motion.div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col gap-5 w-full max-w-md border border-yellow-400/40"
            >
                {!ticketString ? (
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
                            ticketString={ticketString}
                            markedItems={markedItems}
                            onMark={(symbol) => {
                                if (markedItems.includes(symbol))
                                    handleUnmark(symbol);
                                else handleMark(symbol);
                            }}
                        />
                        <div className="flex justify-between items-center mt-3 text-yellow-200 text-sm">
                            <span>⭐ Marked: {markedCount}</span>
                            <button
                                onClick={() => setShowClaimOptions(true)}
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
                    <HistoryIcon /> View Called Codes
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

            {/* ✅ Reusable Called Codes Modal */}
            {showHistory && (
                <CalledCodesModal
                    calledCodes={calledCodes}
                    onClose={() => setShowHistory(false)}
                />
            )}

            {/* Claim Modal */}
            {showClaimOptions && (
                <div className="absolute inset-0 bg-black/60 flex justify-center items-center">
                    <div className="bg-rose-900 border border-yellow-400 p-6 rounded-2xl w-80 text-yellow-200 shadow-lg">
                        <h2 className="text-lg font-bold mb-3 text-center">
                            🏆 Choose Claim Type
                        </h2>
                        <div className="flex flex-col gap-2">
                            {claimOptions.map((type) => (
                                <button
                                    key={type}
                                    onClick={() => handleClaim(type)}
                                    className="bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400"
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowClaimOptions(false)}
                            className="mt-4 w-full bg-yellow-300 text-rose-900 font-bold py-2 rounded-lg hover:bg-yellow-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            {calledPopup && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.4 }}
                    className="fixed top-8 left-1/2 -translate-x-1/2 bg-yellow-300 text-rose-900 px-6 py-3 rounded-2xl shadow-2xl text-lg font-extrabold z-[9999] border-4 border-yellow-500 backdrop-blur-md"
                >
                    {calledPopup}
                </motion.div>
            )}
        </main>
    );
}
