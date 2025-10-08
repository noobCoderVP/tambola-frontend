"use client";
import { diwaliSymbols } from "@/data/symbols";
import { motion } from "framer-motion";

export default function TicketGrid({
    ticketString,
    markedItems,
    onMark,
}: {
    ticketString: string;
    markedItems: string[];
    onMark: (symbol: string) => void;
}) {
    // Parse ticket string like: ",BX,FL,RD,,RS,,HD,\\FD,,,BT,CP,,,PL,PK\\BG,,HC,,,WR,RL,,NT,"
    const ticket: string[][] = ticketString
        .split("\\") // split rows
        .map((row) => row.split(",").map((cell) => cell.trim()));
    
        // Rotate ticket by 90 degrees (clockwise)
    const rotatedTicket: string[][] = ticket[0].map((_, colIndex) =>
        ticket.map((row) => row[colIndex])
    );

    return (
        <div className='flex justify-center items-center'>
            <div className="grid grid-cols-3 gap-4">
                {rotatedTicket.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const symbol = cell.trim();
                        const isMarked = symbol && markedItems.includes(symbol);

                        return (
                            <motion.div
                                key={`${rowIndex}-${colIndex}`}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => symbol != "*" && onMark(symbol)}
                                className={`w-24 h-14 flex flex-col items-center justify-center rounded-xl cursor-pointer text-lg font-bold border transition-all ${
                                    symbol
                                        ? isMarked
                                            ? "bg-yellow-300 text-rose-900 border-yellow-400 scale-105 shadow-md"
                                            : "bg-transparent border-yellow-400 text-yellow-100 hover:bg-yellow-300/30"
                                        : "border-transparent"
                                }`}
                            >
                                {/* Symbol text */}
                                <div>{symbol == "*" ? "" : symbol}</div>

                                {/* Symbol emoji (from diwaliSymbols) */}
                                {symbol && (
                                    <div
                                        className={`text-[10px] ${
                                            isMarked
                                                ? "text-rose-900"
                                                : "text-yellow-200"
                                        }`}
                                    >
                                        {
                                            diwaliSymbols[
                                                symbol as keyof typeof diwaliSymbols
                                            ]
                                        }
                                    </div>
                                )}
                            </motion.div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
