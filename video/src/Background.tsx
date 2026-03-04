import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Mimic the ambient blobs from the website (Light Mode)
  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      <Blob
        color="rgba(147, 51, 234, 0.08)"
        size={width * 0.8}
        x={interpolate(frame, [0, 150], [width * 0.1, width * 0.4])}
        y={interpolate(frame, [0, 150], [height * 0.2, height * -0.1])}
        blur={120}
      />
      <Blob
        color="rgba(59, 130, 246, 0.15)"
        size={width * 0.7}
        x={interpolate(frame, [0, 150], [width * 0.6, width * 0.3])}
        y={interpolate(frame, [0, 150], [height * 0.5, height * 0.8])}
        blur={120}
      />
    </AbsoluteFill>
  );
};

const Blob: React.FC<{
  color: string;
  size: number;
  x: number;
  y: number;
  blur: number;
}> = ({ color, size, x, y, blur }) => {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: x - size / 2,
        top: y - size / 2,
        backgroundColor: color,
        borderRadius: "50%",
        filter: `blur(${blur}px)`,
      }}
    />
  );
};
