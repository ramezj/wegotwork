import React from "react";
import { COLOR_TOKENS } from "./constants";

interface JobCardProps {
  title: string;
  category: string;
  type: string;
  location: string;
  opacity: number;
  y: number;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  category,
  type,
  location,
  opacity,
  y,
}) => {
  return (
    <div
      style={{
        width: 800,
        backgroundColor: COLOR_TOKENS.background,
        border: `1px solid ${COLOR_TOKENS.border}`,
        padding: "40px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        opacity,
        transform: `translateY(${y}px)`,
        // Brand aesthetic: no rounded corners
        borderRadius: 0,
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        marginBottom: 20,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: COLOR_TOKENS.primary,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Badge text={category} />
          <Badge text={type} />
          <Badge text={location} />
        </div>
      </div>
      <div
        style={{
          backgroundColor: COLOR_TOKENS.primary,
          color: COLOR_TOKENS.primaryForeground,
          padding: "16px 32px",
          fontSize: 24,
          fontWeight: 600,
        }}
      >
        View Job
      </div>
    </div>
  );
};

const Badge: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      backgroundColor: COLOR_TOKENS.secondary,
      color: COLOR_TOKENS.secondaryForeground,
      padding: "8px 16px",
      fontSize: 20,
      fontWeight: 500,
      borderRadius: 0,
    }}
  >
    {text}
  </div>
);
