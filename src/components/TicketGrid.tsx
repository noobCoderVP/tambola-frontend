"use client";
import { diwaliSymbols } from "@/data/symbols";
import { motion } from "framer-motion";

export default function TicketGrid({
    ticket,
    markedItems,
    onMark,
}: {
    ticket: string[][];
    markedItems: string[];
    onMark: (symbol: string) => void;
}) {
    return (
        <div className="grid grid-cols-3 gap-2">
            {ticket.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    const symbol = cell.trim();
                    const isMarked = markedItems.includes(symbol);
                    return (
                        <motion.div
                            key={`${rowIndex}-${colIndex}`}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => symbol && onMark(symbol)}
                            className={`w-24 h-14 flex flex-col items-center justify-center rounded-xl cursor-pointer text-lg font-bold border ${
                                symbol
                                    ? isMarked
                                        ? "bg-yellow-300 text-rose-900 border-yellow-400"
                                        : "bg-transparent border-yellow-400 text-yellow-100 hover:bg-yellow-300/30"
                                    : "border-transparent"
                            }`}
                        >
                            <div>{symbol}</div>
                            <div
                                className={`${
                                    symbol
                                        ? isMarked
                                            ? "bg-yellow-300 text-rose-900 border-yellow-400"
                                            : "bg-transparent border-yellow-400 text-yellow-100 hover:bg-yellow-300/30"
                                        : "border-transparent"
                                } text-[10px]`}
                            >
                                {
                                    diwaliSymbols[
                                        symbol as keyof typeof diwaliSymbols
                                    ]
                                }
                            </div>
                        </motion.div>
                    );
                })
            )}
        </div>
    );
}
