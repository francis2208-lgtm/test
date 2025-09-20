import React, { useRef, useEffect } from 'react';

const StarfieldCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        const stars: { x: number, y: number, z: number, size: number }[] = [];
        const numStars = 500;

        const setup = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            stars.length = 0;
            for (let i = 0; i < numStars; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    z: Math.random() * width,
                    size: Math.random() * 1.5 + 0.5
                });
            }
        };

        const draw = () => {
            ctx.fillStyle = '#0a0f1f'; // Match dark-bg
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.translate(width / 2, height / 2);

            for (let star of stars) {
                const x = star.x - width / 2;
                const y = star.y - height / 2;
                const k = 128 / star.z;
                const px = x * k;
                const py = y * k;

                ctx.beginPath();
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, Math.max(0.1, (width - star.z) / width))})`;
                ctx.arc(px, py, star.size * k / 2, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        };

        const update = () => {
            for (let star of stars) {
                star.z -= 1.5;
                if (star.z < 1) {
                    star.z = width;
                }
            }
        };

        const animate = () => {
            draw();
            update();
            animationFrameId = requestAnimationFrame(animate);
        };
        
        const handleResize = () => {
            cancelAnimationFrame(animationFrameId);
            setup();
            animate();
        };

        setup();
        animate();

        window.addEventListener('resize', handleResize);
        
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
};

export default StarfieldCanvas;
