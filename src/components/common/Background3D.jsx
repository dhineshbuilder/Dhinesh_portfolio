import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import { useTheme } from '../../context/ThemeContext';
import { animationConfig } from '../../utils/config';

const Stars = ({ color, size, opacity, mouse }) => {
    const groupRef = useRef();
    const pointsRef = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(animationConfig.background.starCount * 3), { radius: animationConfig.background.radius }));

    useFrame((state, delta) => {
        // Automatic rotation (Points)
        if (pointsRef.current) {
            pointsRef.current.rotation.x -= delta / animationConfig.background.rotationSpeedX;
            pointsRef.current.rotation.y -= delta / animationConfig.background.rotationSpeedY;
        }

        // Mouse parallax (Group)
        if (groupRef.current) {
            const targetRotationX = mouse.current[1] * 0.15;
            const targetRotationY = mouse.current[0] * 0.15;

            groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
            groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
        }
    });

    return (
        <group ref={groupRef} rotation={[0, 0, Math.PI / 4]}>
            <Points ref={pointsRef} positions={sphere} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color={color}
                    opacity={opacity}
                    size={size}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const Background3D = () => {
    const { theme } = useTheme();
    const mouse = useRef([0, 0]);

    const isLight = theme === 'light';
    const color = isLight ? '#2563EB' : '#e2e8f0';
    const starSize = isLight
        ? animationConfig.background.starSize * 1.35
        : animationConfig.background.starSize;
    const opacity = isLight ? 0.22 : 0.75;

    React.useEffect(() => {
        const handleMouseMove = (event) => {
            // Normalize mouse coordinates to -1 to 1
            mouse.current = [
                (event.clientX / window.innerWidth) * 2 - 1,
                -(event.clientY / window.innerHeight) * 2 + 1
            ];
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <Stars color={color} size={starSize} opacity={opacity} mouse={mouse} />
            </Canvas>
        </div>
    );
};



export default Background3D;
