import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Whiteboard() {
    const canvasRef = useRef(null);
    const [color, setColor] = useState('#000000');

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        socket.on('draw', ({ x, y, color }) => {
            context.fillStyle = color;
            context.fillRect(x, y, 5, 5);
        });

        socket.on('clear', () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
        });
    }, []);

    const handleDraw = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const data = { x, y, color };
        socket.emit('draw', data);
    };

    const handleClear = () => {
        socket.emit('clear');
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseMove={handleDraw}
                className="border border-gray-400"
            ></canvas>
            <div>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <button onClick={handleClear} className="px-4 py-2 bg-red-500 text-white rounded">Clear Board</button>
            </div>
        </div>
    );
}
