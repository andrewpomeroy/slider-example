import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";

export default function Page() {
  let initialHeight = 4;
  let height = 12;
  let buffer = 12;
  let [ref, bounds] = useMeasure();
  let [hovered, setHovered] = useState(false);
  let [pressed, setPressed] = useState(false);
  let progress = useMotionValue(0.5);
  let width = useTransform(progress, (v) => `${v * 100}%`);
  let roundedProgress = useTransform(
    progress,
    (v) => `${roundTo(v * 100, 0)}%`
  );
  let [progressState, setProgressState] = useState(roundedProgress.get());
  let state = pressed ? "pressed" : hovered ? "hovered" : "idle";

  useEffect(() => {
    roundedProgress.onChange((v) => setProgressState(v));
  }, [roundedProgress]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (pressed) {
      let newPercent = clamp(
        event.nativeEvent.offsetX / bounds.width,
        0,
        1
      ); 
      progress.set(newPercent);
    }
  };

  return (
    <MotionConfig transition={transition}>
      <div className="flex items-center justify-center h-full max-h-[800px] py-16">
        <div className="w-[375px] h-full bg-gray-800 rounded-2xl flex flex-col justify-center px-4">
          <p className="text-center text-sm font-medium mt-8">
            iOS 16 Slider demo
          </p>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full">
              {/* Slider */}
              <motion.div
                animate={state}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseMove={handleMouseMove}
                onPointerEnter={() => setHovered(true)}
                onPointerLeave={() => setHovered(false)}
                style={{ height: height + buffer }}
                className="flex items-center justify-center relative touch-none grow-0"
                variants={{
                  idle: { width: "calc(95% - 48px)" },
                  hovered: { width: "calc(100% - 48px)" },
                  pressed: { width: "calc(100% - 48px)" },
                }}
                initial={false}
                ref={ref}
              >
                <motion.div
                  initial={false}
                  variants={{
                    idle: { height: initialHeight },
                    hovered: { height },
                    pressed: { height },
                  }}
                  className="relative rounded-full overflow-hidden w-full"
                >
                  <div className="h-full bg-white/20" />
                  <motion.div
                    style={{ width }}
                    className="bg-primary absolute w-[20%] inset-0"
                  />
                </motion.div>
              </motion.div>
            </div>
            {/* Label */}
            <motion.div
              initial={false}
              animate={{
                color:
                  hovered || pressed ? "rgb(255,255,255)" : "rgb(120,113,108)",
              }}
              className={`select-none mt-4 text-center text-sm font-semibold tabular-nums`}
            >
              {progressState}
            </motion.div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

let transition = { type: "spring", bounce: 0, duration: 0.3 };

let clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(num, max), min);

function roundTo(number: number, decimals: number): number {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
