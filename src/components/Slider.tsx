import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from './ui/tooltip';

const Slider = ({ }) => {
  const initialHeight = 6;
  const height = 10;
  const buffer = 12;
  const [ref, bounds] = useMeasure();
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const progress = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const roundedProgress = useTransform(
    progress,
    (v) => `${roundTo(v * 100, 0)}%`
  );
  const [progressState, setProgressState] = useState(roundedProgress.get());
  const [tooltipValue, setTooltipValue] = useState(roundedProgress.get());
  const state = pressed ? "pressed" : hovered ? "hovered" : "idle";
  const knobTransformX = useTransform(
    progress,
    (v) => v * bounds.width 
  );
  const tooltipX = useTransform(
    mouseX,
    (v) => {
      return `calc(${v}px - 50%)`
    }
  );

  useEffect(() => {
    roundedProgress.onChange((v) => setProgressState(v));
  }, [roundedProgress]);
  useEffect(() => {
    mouseX.onChange((v) => {
      // set tooltip %
      setTooltipValue(String(roundTo(v / bounds.width, 2)));
    });
  })

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    console.log("%c💣️ event.nativeEvent.offsetX", "background: aliceblue; color: dodgerblue; font-weight: bold", event.nativeEvent.offsetX);
    mouseX.set(event.nativeEvent.offsetX);
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
    (<div className="flex flex-col items-center justify-center w-full">
      {/* Slider */}
      <div className="relative flex items-center justify-center w-full">
        <motion.div
          animate={state}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseMove={handleMouseMove}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
          style={{ height: height + buffer }}
          className="flex w-full items-center justify-center relative touch-none grow-0"
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
          {/* Knob */}
          <motion.div
            initial={false}
            style={{
              x: `calc(${knobTransformX.get()}px - 50%)`,
            }}
            className={`absolute left-0 top-50% origin-center pointer-events-none`}
          >
            <div
              className={`w-4 h-4  bg-white rounded-full shadow-lg origin-center ${hovered || pressed ? "scale-[1]" : "scale-[0]"} transition-all`}
            />
          </motion.div>
        </motion.div>
        {/* Pointer-tooltip surrogate */}
        <Tooltip open={hovered}>
          <TooltipTrigger asChild>
            <motion.div className="absolute left-0 top-0 pointer-events-none" style={{
              x: tooltipX
            }} aria-hidden={true}>
              <span className="opacity-0">
                Tooltip surrogate
              </span>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="pointer-events-none">
            {tooltipValue}
          </TooltipContent>
        </Tooltip>
      </div>
      {/* Label */}
      <motion.div
        initial={false}
        animate={{
          color:
            hovered || pressed ? "rgb(255,255,255)" : "rgb(120,113,108)",
        }}
        className={`select-none mt-2 text-center text-sm font-semibold tabular-nums`}
      >
        {progressState}
      </motion.div>
    </div>)
  );
}

let clamp = (num: number, min: number, max: number) =>
  Math.max(Math.min(num, max), min);

function roundTo(number: number, decimals: number): number {
  return Math.round(number * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

export default Slider;