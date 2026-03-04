import { Composition } from "remotion";
import { HirearkAnimation } from "./HirearkAnimation";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HirearkComposition"
        component={HirearkAnimation}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
