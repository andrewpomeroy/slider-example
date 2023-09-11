import {
  motion,
  MotionConfig,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import useMeasure from "react-use-measure";
import Slider from "../components/Slider";

export default function Page() {


  return (
    <MotionConfig transition={transition}>
      <div className="flex items-center justify-center h-full max-h-[800px] py-16">
        <div className="w-[375px] h-full bg-gray-800 rounded-2xl flex flex-col justify-center px-4">
          <p className="text-center text-sm font-medium mt-8">
            iOS 16 Slider demo
          </p>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="flex items-center justify-center w-full">
              <Slider />
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

let transition = { type: "spring", bounce: 0, duration: 0.3 };
