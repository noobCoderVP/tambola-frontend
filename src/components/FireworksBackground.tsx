"use client";
import { useEffect, useRef } from "react";

export default function FireworksBackground() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const fireworks: any[] = [];

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);

        // 🎆 Firework Particle Class
        class Firework {
            x: number;
            y: number;
            vx: number;
            vy: number;
            alpha: number;
            color: string;
            size: number;
            gravity: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = height - Math.random() * (height / 3);
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 5 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.alpha = 1;
                this.size = Math.random() * 3 + 2;
                this.gravity = 0.06;

                const colors = [
                    "#FFD700", // gold
                    "#FFA500", // orange
                    "#FF6B6B", // rose
                    "#FFB347", // amber
                    "#FFD1DC", // soft pink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity;
                this.alpha -= 0.012;
            }

            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        // ✨ Continuous Animation Loop
        function loop() {
            ctx.clearRect(0, 0, width, height);

            if (Math.random() < 0.1) {
                const burstCount = Math.floor(Math.random() * 30) + 10;
                for (let i = 0; i < burstCount; i++)
                    fireworks.push(new Firework());
            }

            for (let i = fireworks.length - 1; i >= 0; i--) {
                const f = fireworks[i];
                f.update();
                f.draw();
                if (f.alpha <= 0) fireworks.splice(i, 1);
            }

            requestAnimationFrame(loop);
        }

        loop();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9999] pointer-events-none"
            style={{
                background: "transparent",
                mixBlendMode: "screen", // glowing overlay
            }}
        />
    );
}
