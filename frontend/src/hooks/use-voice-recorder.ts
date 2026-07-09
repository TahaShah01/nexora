"use client";

import { useRef, useState } from "react";

/** Records audio via the browser's MediaRecorder API — no server round-trip until the clip is finished and uploaded. */
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  }

  function stop(): Promise<File> {
    return new Promise((resolve, reject) => {
      const recorder = recorderRef.current;
      if (!recorder) {
        reject(new Error("Not recording"));
        return;
      }
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        recorder.stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
        resolve(new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" }));
      };
      recorder.stop();
    });
  }

  return { isRecording, start, stop };
}
