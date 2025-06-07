"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/socket";
import { Button } from "../ui/button";

export default function Whiteboard({ roomId, nickname }: { roomId: string, nickname: string }) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [color, setColor] = useState("#000000");
	const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

	const clearBoard = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}

	const drawLine = (x0: number, y0: number, x1: number, y1: number, color: string, emit: boolean) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(x0, y0);
		ctx.lineTo(x1, y1);
		ctx.strokeStyle = color;
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.closePath();

		if (!emit) return;
		socket.emit("draw", { x0, y0, x1, y1, color, roomId, nickname });
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDrawing(true);
		setLastPoint({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDrawing || !lastPoint) return;
		const x = e.nativeEvent.offsetX;
		const y = e.nativeEvent.offsetY;
		drawLine(lastPoint.x, lastPoint.y, x, y, color, true);
		setLastPoint({ x, y });
	};

	const handleMouseUp = () => {
		setIsDrawing(false);
		setLastPoint(null);
	};

	const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		const touch = e.touches[0];
		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;

		setIsDrawing(true);
		setLastPoint({
			x: touch.clientX - rect.left,
			y: touch.clientY - rect.top
		});
	};

	const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
		e.preventDefault();
		if (!isDrawing || !lastPoint) return;

		const touch = e.touches[0];
		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return;

		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;

		drawLine(lastPoint.x, lastPoint.y, x, y, color, true);
		setLastPoint({ x, y });

		e.preventDefault();
	};

	// sockt
	useEffect(() => {
		socket.on(
			"draw",
			({ x0, y0, x1, y1, color, room, nickname }: { x0: number; y0: number; x1: number; y1: number; color: string; room: string; nickname: string }) => {
				if (room === roomId) {
					drawLine(x0, y0, x1, y1, color, false);
					console.log(`Drawn by ${nickname} in room ${room}`);
				}
			}
		);
		return () => {
			socket.off("draw");
		};
	}, [roomId, nickname]);

	useEffect(() => {
		const onClear = (data: { room: string }) => {
			if (data.room === roomId) {
				clearBoard();
			}
		};

		socket.on("clear-canvas", onClear);

		return () => {
			socket.off("clear-canvas", onClear);
		};
	}, [roomId]);

	const handleClearClick = () => {
		clearBoard();
		socket.emit("clear-canvas", { room: roomId });
	};

	return (
	<div className="flex flex-col items-center p-1 rounded-lg border shadow w-full">
		<div className="w-full mb-3">
			<div className="flex justify-between items-center">
				<div className="font-bold pl-2">
					Draw and colab with room members!
				</div>
				<div className="flex items-center space-x-2">
					<Button
						type="button"
						variant="default"
						className="align-middle cursor-pointer mt-1"
						onClick={handleClearClick}
					>
						Clear Whiteboard
					</Button>
					<input
						type="color"
						value={color}
						onChange={(e) => setColor(e.target.value)}
						className="p-0 border-none cursor-pointer rounded-full"
					/>
				</div>
			</div>
		</div>

		<div
			className="w-full max-w-full overflow-auto border rounded-md"
			style={{
				maxHeight: "70vh",
				maxWidth: "100%",
			}}
		>
			<canvas
				ref={canvasRef}
				width={2000}
				height={2000}
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseUp}
				onTouchStart={handleTouchStart}
				onTouchMove={handleTouchMove}
				onTouchEnd={handleMouseUp}
				className="rounded-md shadow cursor-crosshair touch-none block"
			/>
		</div>
	</div>
);

}
