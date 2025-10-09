"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CelebrationIcon from "@mui/icons-material/Celebration";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import HistoryIcon from "@mui/icons-material/History";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { fetchWrapper } from "@/utils/fetch";
import TicketGrid from "@/components/TicketGrid";
import { useParams, useRouter } from "next/navigation";
import io from "socket.io-client";
import CalledCodesModal from "@/components/CalledCodesModal";
import { ArrowBack } from "@mui/icons-material";
import FireworksBackground from "@/components/FireworksBackground";
import Fireworks from "@/components/Fireworks";
import { diwaliSymbols } from "@/data/symbols";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, { autoConnect: true });

export default function RoomPage() {
    const params: any = useParams();
    const router = useRouter();
    const code = params.code?.toUpperCase() || "";
    const [username, setPlayerName] = useState<string>("");
    const [ticketString, setTicketString] = useState<string | null>(null);
    const [ticketId, setTicketId] = useState<string | null>(null);
    const [markedItems, setMarkedItems] = useState<string[]>([]);
    const [markedCount, setMarkedCount] = useState(0);
    const [calledCodes, setCalledCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showClaimOptions, setShowClaimOptions] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [loadingTicket, setLoadingTicket] = useState(true);
    const [calledPopup, setCalledPopup] = useState<string | null>(null);

    const claimOptions = [
        "First Five",
        "First Column",
        "Second Column",
        "Third Column",
        "Full House",
    ];

    // ✅ Unified Popup Function
    const showPopup = (text: string, duration = 3000) => {
        setCalledPopup(text);
        setTimeout(() => setCalledPopup(null), duration);
    };

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
                showPopup("⚠️ Failed to load called codes.");
            }
        } catch {
            showPopup("⚠️ Error loading history.");
        }
    };

    // ✅ Claim Handler
    const handleClaim = async (type: string) => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/verify-claim`,
                method: "POST",
                data: { player: username, type },
            });
            const data = await res.json();

            if (res.ok) {
                showPopup(data.message || "✅ Claim submitted!");
                socket.emit("claim-received", {
                    code,
                    type,
                    player: username,
                });
            } else {
                showPopup(data.message || "❌ Claim failed.");
            }
        } catch {
            showPopup("⚠️ Claim request failed.");
        } finally {
            setShowClaimOptions(false);
        }
    };

    useEffect(() => {
        const storedName = localStorage.getItem("username");
        if (storedName) setPlayerName(storedName);
        fetchTicket();

        // Join socket room
        if (code && storedName) {
            socket.emit("user-joined", { code, username: storedName });
        }

        socket.on("game-started", () => {
            showPopup("🔥 Game started!");
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 4000);
        });

        socket.on("code-called", (calledCode: string) => {
            console.log("Code called:", calledCode);
            showPopup(`🎯 Number Called: ${calledCode} (${diwaliSymbols[calledCode as keyof typeof diwaliSymbols]})`);
            setShowFireworks(true);
            setTimeout(() => setShowFireworks(false), 3000);
        });

        socket.on("claim-received", ({ player, type }) => {
            showPopup(`🏆 ${player} made a claim: ${type}`);
        });

        return () => {
            socket.off("game-started");
            socket.off("code-called");
            socket.off("claim-received");
            socket.disconnect();
        };
    }, []);

    const fetchTicket = async () => {
        setLoadingTicket(true);
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
        } finally {
            setLoadingTicket(false);
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
                showPopup("🎟️ Ticket generated successfully!");
            } else {
                showPopup(data.message || "❌ Failed to generate ticket.");
            }
        } catch {
            showPopup("⚠️ Something went wrong.");
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
        }).catch(console.error);
    };

    const handleUnmark = async (symbol: string) => {
        if (!symbol || !ticketId) return;
        const updatedMarks = markedItems.filter((i) => i !== symbol);
        setMarkedItems(updatedMarks);
        setMarkedCount(updatedMarks.length);
        fetchWrapper({
            url: `/tickets/${ticketId}/mark`,
            method: "PATCH",
            data: { markedItems: updatedMarks },
        }).catch(console.error);
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
            <FireworksBackground />
            {showFireworks && <Fireworks />}

            {/* Back */}
            <button
                onClick={() => window.history.back()}
                className="absolute top-5 left-5 flex items-center gap-1 text-yellow-200 hover:text-yellow-400 transition"
            >
                <ArrowBack fontSize="small" /> Back
            </button>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center mt-12 mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Diwali Housie Room
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    🪔 Welcome <span className="font-bold">{username}</span> |
                    Room: <span className="font-bold">{code}</span>
                </p>
            </motion.div>

            {/* Main content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md flex flex-col gap-5 w-full max-w-md border border-yellow-400/40"
            >
                {loadingTicket ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="w-8 h-8 border-4 border-yellow-300 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : !ticketString ? (
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
                            onMark={(symbol) =>
                                markedItems.includes(symbol)
                                    ? handleUnmark(symbol)
                                    : handleMark(symbol)
                            }
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

                        {/* View & Leaderboard Buttons */}
                        <div className="flex justify-between gap-3 mt-3">
                            <button
                                onClick={fetchHistory}
                                className="flex-1 flex items-center justify-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                            >
                                <HistoryIcon fontSize="small" /> View Called
                                Codes
                            </button>

                            <button
                                onClick={() =>
                                    router.push(`/room/leaderboard/${code}`)
                                }
                                className="flex-1 flex items-center justify-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                            >
                                <LeaderboardIcon fontSize="small" /> Leaderboard
                            </button>
                        </div>
                    </>
                )}
            </motion.div>

            {/* Modals */}
            {showHistory && (
                <CalledCodesModal
                    calledCodes={calledCodes}
                    onClose={() => setShowHistory(false)}
                />
            )}

            {showClaimOptions && (
                <div className="absolute inset-0 bg-black/60 flex justify-center items-center z-[50]">
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

            {/* 🎯 Popup */}
            {calledPopup && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 bg-black/60 flex justify-center items-center z-[100]"
                >
                    <div className="bg-yellow-300 text-rose-900 px-8 py-5 rounded-2xl shadow-2xl text-xl font-extrabold border-4 border-yellow-500 backdrop-blur-md text-center animate-bounce">
                        {calledPopup}
                    </div>
                </motion.div>
            )}
        </main>
    );
}
