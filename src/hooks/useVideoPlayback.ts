import { create } from "zustand";
import { useEffect, useRef } from "react";

// Define a type for the state
type VideoState = {
  playing: boolean;
  currentTime: number;
  startTime: number;
  totalDuration: number;
  play: () => void;
  pause: () => void;
  tick: (frameTime: number) => void;
};

// Create the Zustand store
const useStore = create<VideoState>((set, get) => ({
  playing: false,
  currentTime: 0,
  startTime: 0,
  totalDuration: 0,
  play: () => {
    const { playing, currentTime } = get();
    if (!playing) {
      set({ playing: true, startTime: performance.now() - currentTime });
    }
  },
  pause: () => {
    get().tick(performance.now()); // Update currentTime before pausing
    set({ playing: false });
  },
  tick: (frameTime: number) => {
    const { startTime, totalDuration } = get();
    let currentTime = frameTime - startTime;
    if (currentTime >= totalDuration) {
      currentTime = totalDuration;
      set({ playing: false });
    }
    set({ currentTime });
  },
}));

// React hook that wraps the Zustand store
function useVideoPlayback(initialTime: number, totalDuration: number) {
  const state = useStore();
  const frameId = useRef<number>();

  // Initialize the state
  useEffect(() => {
    useStore.setState({
      currentTime: initialTime,
      totalDuration: totalDuration,
    });
  }, [initialTime, totalDuration]);

  // Effect for handling the play state and updating the current time
  useEffect(() => {
    const animate = (time: number) => {
      state.tick(time);
      if (state.playing) {
        frameId.current = requestAnimationFrame(animate);
      }
    };

    if (state.playing) {
      frameId.current = requestAnimationFrame(animate);
    }

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [state]);

  // Expose play, pause, and currentTime
  return {
    play: state.play,
    pause: state.pause,
    playing: state.playing,
    currentTime: state.currentTime,
  };
}

export default useVideoPlayback;
