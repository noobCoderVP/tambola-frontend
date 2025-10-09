"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import io from "socket.io-client";
import CelebrationIcon from "@mui/icons-material/Celebration";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import { fetchWrapper } from "@/utils/fetch";
import { useParams, useRouter } from "next/navigation";
import CalledCodesModal from "@/components/CalledCodesModal";
import Fireworks from "@/components/Fireworks";
import Popup from "@/components/Popup";
import { ArrowBack, People } from "@mui/icons-material";
import CodeLoader from "@/components/CodeLoader";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "", {
    autoConnect: true,
});

export default function HostRoomPage() {
    const params: any = useParams();
    const router = useRouter();
    const code = params.code?.toUpperCase() || "";
    const [room, setRoom] = useState<any>(null);
    const [calledCodes, setCalledCodes] = useState<string[]>([]);
    const [lastCalled, setLastCalled] = useState<string | null>(null);
    const [lastMeaning, setLastMeaning] = useState<string | null>(null);
    const [popupMsg, setPopupMsg] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showFireworks, setShowFireworks] = useState(false);
    const [showCountdown, setShowCountdown] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // ✅ Fetch room data
    const fetchRoom = async () => {
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}`,
                method: "GET",
            });
            const data = await res.json();
            setRoom(data);
            setCalledCodes(data.calledCodes || []);
        } catch {
            setPopupMsg("⚠️ Failed to load room details.");
        }
    };

    useEffect(() => {
        fetchRoom();

        socket.on("game-started", () => {
            setPopupMsg("🔥 Game started!");
            setRoom((r: any) => ({ ...r, isActive: true }));
        });

        socket.on("code-called", (calledCode) => {
            setCalledCodes((prev) => [...prev, calledCode]);
            setLastCalled(calledCode);
        });

        socket.on("claim-received", ({ player, type }) => {
            console.log(`Claim received: ${player} - ${type}`);
            setPopupMsg(`🏆 ${player} made a claim: ${type}`);
        });

        return () => {
            socket.off("game-started");
            socket.off("code-called");
            socket.off("claim-received");
            socket.disconnect();
        };
    }, []);

    // ✅ Start Game
    const startGame = async () => {
        setLoading(true);
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/start`,
                method: "POST",
                data: { host: localStorage.getItem("username"), code },
            });
            const data = await res.json();
            if (res.ok) {
                socket.emit("game-started", { code });
                setPopupMsg(`🪔 Game Started!`);
            } else {
                setPopupMsg(data.message || "⚠️ Could not start game.");
            }
        } catch {
            setPopupMsg("⚠️ Error starting game.");
        } finally {
            setLoading(false);
            location.reload();
        }
    };

    // ✅ Call Random Code (with suspense + fireworks)
    const callRandomCode = async () => {
        if (loading) return;
        setLoading(true);
        setShowCountdown(true);
        setCountdown(3);
        setPopupMsg("");

        const countdownInterval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(countdownInterval);
                    setShowCountdown(false);
                }
                return prev - 1;
            });
        }, 1000);

        setTimeout(async () => {
            try {
                const res = await fetchWrapper({
                    url: `/rooms/${code}/call`,
                    method: "POST",
                    data: { host: localStorage.getItem("username") },
                });
                const data = await res.json();
                if (res.ok && data.item) {
                    socket.emit("code-called", {
                        code: code,
                        calledCode: data.item,
                    });

                    setLastCalled(data.item);
                    setLastMeaning(data.meaning);
                    setCalledCodes((prev) => [...prev, data.item]);
                    setShowFireworks(true);
                    setTimeout(() => setShowFireworks(false), 2500);
                } else {
                    setPopupMsg(data.message || "No more codes left!");
                }
            } catch {
                setPopupMsg("⚠️ Error calling code.");
            } finally {
                setLoading(false);
            }
        }, 3000);
    };


    // ✅ Close Game
    const closeRoom = async () => {
        setLoading(true);
        try {
            const res = await fetchWrapper({
                url: `/rooms/${code}/close`,
                method: "POST",
                data: { host: localStorage.getItem("username") },
            });
            const data = await res.json();

            if (res.ok) {
                socket.emit("game-closed", { code });
                setPopupMsg(`🪔 Game Closed!`);
                router.push("/");
            } else {
                setPopupMsg(data.message || "⚠️ Could not close game.");
            }
        } catch {
            setPopupMsg("⚠️ Error closing game.");
        } finally {
            setLoading(false);
            setConfirmClose(false);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-amber-700 via-orange-800 to-rose-900 text-white relative overflow-hidden">
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
                className="flex flex-col items-center mt-10 mb-6"
            >
                <div className="flex items-center gap-3 mb-2">
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                    <h1 className="text-3xl font-extrabold tracking-wide text-center">
                        Host Room – Diwali Housie
                    </h1>
                    <CelebrationIcon sx={{ fontSize: 40, color: "#FFD700" }} />
                </div>
                <p className="text-yellow-200 text-sm">
                    Room Code: <span className="font-bold">{code}</span>
                </p>
            </motion.div>

            {/* Start / Call Buttons */}
            <div className="flex flex-col gap-4 w-full max-w-xs items-center">
                {!room?.isActive ? (
                    <button
                        onClick={startGame}
                        disabled={loading}
                        className="relative bg-yellow-300 text-rose-900 font-extrabold py-6 px-10 rounded-full text-2xl shadow-[0_0_20px_rgba(255,215,0,0.8)] hover:shadow-[0_0_35px_rgba(255,215,0,1)] hover:bg-yellow-400 active:scale-95 transition-all"
                    >
                        {loading ? "Starting..." : "🚀 Start Game"}
                    </button>
                ) : (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={callRandomCode}
                        disabled={loading}
                        className="relative bg-yellow-300 text-rose-900 font-extrabold py-6 px-10 rounded-full text-2xl shadow-[0_0_20px_rgba(255,215,0,0.8)] hover:shadow-[0_0_35px_rgba(255,215,0,1)] hover:bg-yellow-400 active:scale-95 transition-all"
                    >
                        {loading ? "Calling..." : "🎆 CALL CODE 🎆"}
                    </motion.button>
                )}
            </div>

            {/* Countdown */}
            {showCountdown && (
                <motion.div
                    key={countdown}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mt-8 text-6xl font-extrabold text-yellow-300 drop-shadow-lg"
                >
                    {countdown > 0 ? countdown : ""}
                </motion.div>
            )}

            {/* Loader or Last Called */}
            {loading && !showCountdown ? (
                <CodeLoader />
            ) : (
                lastCalled &&
                !showCountdown && (
                    <motion.div
                        key={lastCalled}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-yellow-100 text-lg">Last Called:</p>
                        <p className="text-6xl font-extrabold text-yellow-300 tracking-widest mt-2 drop-shadow-lg">
                            {lastCalled}
                        </p>
                        {lastMeaning && (
                            <p className="text-yellow-200 text-lg mt-2 italic">
                                “{lastMeaning}”
                            </p>
                        )}
                    </motion.div>
                )
            )}

            {showFireworks && <Fireworks />}

            {/* Buttons Section */}
            <div className="flex flex-col gap-3 mt-10 w-full max-w-xs">
                <button
                    onClick={() => setShowHistory(true)}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                >
                    <HistoryIcon fontSize="small" /> View Called Codes
                </button>

                <button
                    onClick={() => router.push(`/room/leaderboard/${code}`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                >
                    <LeaderboardIcon fontSize="small" /> Leaderboard
                </button>

                <button
                    onClick={() => router.push(`/room/players/${code}`)}
                    className="flex-1 flex items-center justify-center gap-1 bg-yellow-300 text-rose-900 font-bold px-4 py-2 rounded-lg hover:bg-yellow-400 transition active:scale-95"
                >
                    <People fontSize="small" /> Players
                </button>

                <button
                    onClick={() => setConfirmClose(true)}
                    className="flex items-center justify-center gap-2 bg-rose-800 text-yellow-100 font-bold py-3 rounded-xl hover:bg-rose-700 border border-yellow-400 transition"
                >
                    <CloseIcon /> Close Room
                </button>
            </div>

            {/* Modals */}
            {showHistory && (
                <CalledCodesModal
                    calledCodes={calledCodes}
                    onClose={() => setShowHistory(false)}
                />
            )}

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
                🎇 Let the Diwali Luck Decide the Next Code!
            </motion.div>

            {/* Popup */}
            <Popup message={popupMsg} onClose={() => setPopupMsg("")} />
        </main>
    );
}
