"use client";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  [key: string]: unknown;
}) => {
  const noise = createNoise3D();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wRef = useRef<number>(0);
  const hRef = useRef<number>(0);
  const ntRef = useRef<number>(0);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationIdRef = useRef<number>(0);
  
  const getSpeed = useCallback(() => {
    switch (speed) {
      case "slow":
        return 0.002;
      case "fast":
        return 0.006;
      default:
        return 0.004;
    }
  }, [speed]);

  const waveColors = useMemo(() => colors ?? [
    "#38bdf8",
    "#818cf8",
    "#c084fc",
    "#e879f9",
    "#22d3ee",
  ], [colors]);
  
  const drawWave = useCallback((n: number) => {
    if (!ctxRef.current) return;
    ntRef.current += getSpeed();
    for (let i = 0; i < n; i++) {
      ctxRef.current.beginPath();
      ctxRef.current.lineWidth = waveWidth || 50;
      ctxRef.current.strokeStyle = waveColors[i % waveColors.length];
      for (let x = 0; x < wRef.current; x += 5) {
        const y = noise(x / 800, 0.3 * i, ntRef.current) * 100;
        ctxRef.current.lineTo(x, y + hRef.current * 0.5); // adjust for height, currently at 50% of the container
      }
      ctxRef.current.stroke();
      ctxRef.current.closePath();
    }
  }, [waveColors, waveWidth, noise, getSpeed]);

  const render = useCallback(() => {
    if (!ctxRef.current) return;
    ctxRef.current.fillStyle = backgroundFill || "black";
    ctxRef.current.globalAlpha = waveOpacity || 0.5;
    ctxRef.current.fillRect(0, 0, wRef.current, hRef.current);
    drawWave(5);
    animationIdRef.current = requestAnimationFrame(render);
  }, [backgroundFill, waveOpacity, drawWave]);

  const init = useCallback(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");
    if (!ctxRef.current) return;
    wRef.current = ctxRef.current.canvas.width = window.innerWidth;
    hRef.current = ctxRef.current.canvas.height = window.innerHeight;
    ctxRef.current.filter = `blur(${blur}px)`;
    ntRef.current = 0;
    window.onresize = function () {
      if (!ctxRef.current) return;
      wRef.current = ctxRef.current.canvas.width = window.innerWidth;
      hRef.current = ctxRef.current.canvas.height = window.innerHeight;
      ctxRef.current.filter = `blur(${blur}px)`;
    };
    render();
  }, [blur, render]);

  useEffect(() => {
    init();
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [init]);

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // I'm sorry but i have got to support it on safari.
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col items-center justify-center",
        containerClassName
      )}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};