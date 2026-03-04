import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Series,
} from "remotion";
import { Background } from "./Background";
import { JobCard } from "./JobCard";
import { COLOR_TOKENS, BRAND_NAME } from "./constants";

export const HirearkAnimation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the logo
  const logoEntrance = spring({
    frame: frame - 5,
    fps,
    config: {
      damping: 12,
    },
  });

  const logoOpacity = interpolate(frame, [5, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoScale = interpolate(logoEntrance, [0, 1], [0.8, 1]);
  const logoBlur = interpolate(logoEntrance, [0, 1], [20, 0]);

  // Transition out of the central logo
  const logoExit = spring({
    frame: frame - 45,
    fps,
    config: {
      damping: 12,
    },
  });

  const logoYOffset = interpolate(logoExit, [0, 1], [0, -400]);
  const logoFinalScale = interpolate(logoExit, [0, 1], [1, 0.4]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLOR_TOKENS.background,
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Background />

      {/* Brand Text */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `translateY(${logoYOffset}px) scale(${logoFinalScale * logoScale})`,
          filter: `blur(${logoBlur}px)`,
          color: COLOR_TOKENS.primary,
          fontSize: 160,
          fontWeight: 700,
          letterSpacing: "-0.05em",
          position: "absolute",
          zIndex: 10,
        }}
      >
        {BRAND_NAME}
      </div>

      {/* Jobs Sequence */}
      <Sequence frameStart={50}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            marginTop: 100,
          }}
        >
          <AnimatedJobCard
            index={0}
            title="Frontend Engineer"
            category="Engineering"
            type="Full Time"
            location="Remote"
          />
          <AnimatedJobCard
            index={1}
            title="Product Designer"
            category="Design"
            type="Contract"
            location="Hybrid"
          />
          <AnimatedJobCard
            index={2}
            title="Growth Marketer"
            category="Marketing"
            type="Part Time"
            location="On Site"
          />
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};

const Sequence: React.FC<{ frameStart: number; children: React.ReactNode }> = ({
  frameStart,
  children,
}) => {
  const frame = useCurrentFrame();
  if (frame < frameStart) return null;
  return <>{children}</>;
};

const AnimatedJobCard: React.FC<{
  index: number;
  title: string;
  category: string;
  type: string;
  location: string;
}> = ({ index, title, category, type, location }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = 50 + index * 10;
  const entrance = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 15,
    },
  });

  const opacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const y = interpolate(entrance, [0, 1], [100, 0]);

  return (
    <JobCard
      title={title}
      category={category}
      type={type}
      location={location}
      opacity={opacity}
      y={y}
    />
  );
};
