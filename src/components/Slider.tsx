import { motion, useMotionValue, useTransform } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';
import useMeasure from 'react-use-measure';
import { TooltipContent, TooltipTrigger, TooltipProvider, Tooltip } from './ui/tooltip';

const TOTAL_TIME = 80000

const msToTime = (ms: number) => {
  if (!ms) return "00:00";
  if (ms === Infinity) {
  }
  return new Date(ms).toISOString().slice(14, -5);
}

const progressRatioToTime = (progressRatio: number) => {
  return msToTime(progressRatio * TOTAL_TIME);
}

const Slider = ({ }) => {
  const initialHeight = 6;
  const height = 10;
  const buffer = 12;
  const [ref, bounds] = useMeasure();
  const [hovered, setHovered] = useState(false);
  const [knobHovered, setKnobHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const progress = useMotionValue(0.5);
  const mouseX = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v * 100}%`);
  const roundedProgress = useTransform(
    progress,
    (v) => progressRatioToTime(v)
  );
  const [tooltipContent, setTooltipContent] = useState(roundedProgress.get());
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
    mouseX.onChange((v) => {
      const progressRatio = clamp(
        v / bounds.width,
        0,
        1
      );
      setTooltipContent(String(progressRatioToTime(progressRatio)));
    });
  })

  const getTimelineCursorOffsetX = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const { clientX } = event.nativeEvent;
    const { left } = bounds;
    return clientX - left;
  }, [bounds]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const offsetX = getTimelineCursorOffsetX(event);
    mouseX.set(offsetX);
    if (pressed) {
      setNewProgress(event);
    }
  };

  const setNewProgress = (event: React.MouseEvent<HTMLDivElement>) => {
    let newPercent = clamp(
      getTimelineCursorOffsetX(event) / bounds.width,
      0,
      1
    );
    progress.set(newPercent);
  }

  return (
    (<div className="flex flex-col items-center justify-center w-full">
      {/* Slider */}
      <div className="relative flex items-center justify-center w-full">
        <motion.div
          animate={state}
          onMouseDown={(event) => {
            setPressed(true);
            setNewProgress(event);
          }}
          // TODO: onMouseUp doesn't fire when you release the mouse outside the slider
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
          {/* Pointer-tooltip surrogate */}
          <Tooltip open={hovered && !knobHovered}>
            <TooltipTrigger asChild>
              <motion.div className="absolute left-0 top-0 h-full pointer-events-none" style={{
                x: tooltipX
              }} aria-hidden={true}>
                <motion.div className={`absolute left-[-.5px] top-0 w-[1px] h-full bg-blue-300 ${hovered && !knobHovered ? "opacity-100" : "opacity-0"}`} 
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent asChild className="pointer-events-none">
              <motion.div>
                {tooltipContent}
              </motion.div>
            </TooltipContent>
          </Tooltip>
          {/* Knob */}
          <motion.div
            initial={false}
            style={{
              x: `calc(${knobTransformX.get()}px - 50%)`,
            }}
            className={`absolute left-0 top-50% origin-center ${pressed ? "cursor-grabbing" : "cursor-grab"}`}
            onMouseEnter={() => setKnobHovered(true)}
            onMouseLeave={() => setKnobHovered(false)}
          >
            <motion.div
              className={`w-4 h-4  bg-white rounded-full shadow-lg origin-center transition-all
              `}
              // ${hovered || pressed ? "scale-[1]" : "scale-[0]"}
              // variants={{
              //   idle: { scale: 0 },
              //   hovered: { scale: 1 },
              //   pressed: { scale: 1 },
              // }}
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
        className={`select-none mt-2 text-center text-sm font-semibold tabular-nums`}
      >
        {roundedProgress.get()}
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