"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, AlertCircle, Users, Camera } from "lucide-react";

interface VideoCallProps {
  token: string;
  roomUrl: string;
  onLeave: () => void;
  participantName: string;
}

type Stage = "permissions" | "connecting" | "connected" | "error";

// Global singleton to prevent duplicate Daily instances
let globalCallInstance: any = null;

async function destroyGlobalInstance() {
  if (globalCallInstance) {
    try {
      await globalCallInstance.leave();
    } catch {}
    try {
      await globalCallInstance.destroy();
    } catch {}
    globalCallInstance = null;
  }
}

export function VideoCall({ token, roomUrl, onLeave, participantName }: VideoCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(true);

  const [stage, setStage] = useState<Stage>("permissions");
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteJoined, setRemoteJoined] = useState(false);

  const handleLeave = useCallback(async () => {
    mountedRef.current = false;
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    await destroyGlobalInstance();
    onLeave();
  }, [onLeave]);

  const attachRemote = useCallback((participant: any) => {
    if (!participant || participant.local) return;
    if (participant.videoTrack && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = new MediaStream([participant.videoTrack]);
    }
    if (participant.audioTrack && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = new MediaStream([participant.audioTrack]);
    }
  }, []);

  const joinCall = useCallback(async (stream: MediaStream) => {
    if (!mountedRef.current) return;
    setStage("connecting");

    try {
      // Always destroy any existing instance first
      await destroyGlobalInstance();

      const { default: DailyIframe } = await import("@daily-co/daily-js");

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      const call = DailyIframe.createCallObject({
        videoSource: videoTrack || true,
        audioSource: audioTrack || true,
      });

      globalCallInstance = call;

      call.on("joined-meeting", () => {
        if (!mountedRef.current) return;
        setStage("connected");
        const local = call.participants().local;
        if (local?.videoTrack && localVideoRef.current) {
          localVideoRef.current.srcObject = new MediaStream([local.videoTrack]);
        }
      });

      call.on("participant-joined", (evt: any) => {
        if (!mountedRef.current) return;
        setRemoteJoined(true);
        attachRemote(evt.participant);
      });

      call.on("participant-updated", (evt: any) => {
        if (!mountedRef.current || evt.participant.local) return;
        attachRemote(evt.participant);
      });

      call.on("track-started", (evt: any) => {
        if (!mountedRef.current || evt.participant?.local) return;
        attachRemote(evt.participant);
      });

      call.on("participant-left", () => {
        if (!mountedRef.current) return;
        setRemoteJoined(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });

      call.on("error", (e: any) => {
        if (!mountedRef.current) return;
        setError(e?.errorMsg ?? "Video call error occurred.");
        setStage("error");
      });

      // Do not wire left-meeting to onLeave — only user action does that
      call.on("left-meeting", () => {});

      await call.join({ url: roomUrl, token });

    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(err?.message ?? "Failed to connect to video call.");
      setStage("error");
    }
  }, [roomUrl, token, attachRemote]);

  const requestPermissions = useCallback(async () => {
    if (!mountedRef.current) return;
    setStage("permissions");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!mountedRef.current) {
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      await joinCall(stream);
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(
        err?.name === "NotAllowedError"
          ? "Camera/microphone access denied. Please allow access in browser settings and try again."
          : err?.name === "NotFoundError"
          ? "No camera or microphone found. Please connect a device and try again."
          : "Could not access camera/microphone: " + (err?.message ?? "Unknown error")
      );
      setStage("error");
    }
  }, [joinCall]);

  useEffect(() => {
    mountedRef.current = true;
    requestPermissions();

    return () => {
      mountedRef.current = false;
      // Stop local stream tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      // Do NOT destroy global instance here — only destroy on explicit leave
      // This prevents the duplicate instance error on React StrictMode double-mount
    };
  }, []);

  const toggleMic = async () => {
    if (!globalCallInstance) return;
    await globalCallInstance.setLocalAudio(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    if (!globalCallInstance) return;
    await globalCallInstance.setLocalVideo(!camOn);
    setCamOn(!camOn);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${stage === "connected" ? "bg-green-400 animate-pulse" : "bg-amber-400"}`} />
          <span className="text-white font-semibold">SoloDoc Video Consultation</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          {stage === "connected"
            ? remoteJoined ? "2 participants" : "Waiting for other participant..."
            : stage === "connecting" ? "Connecting..."
            : "Setting up..."}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 p-4">

        {stage === "permissions" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 p-6">
            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center">
              <Camera className="w-10 h-10 text-blue-400" />
            </div>
            <div className="text-center">
              <h2 className="text-white text-xl font-semibold mb-2">Camera & Microphone Access</h2>
              <p className="text-slate-400 text-sm max-w-sm">
                Please click <strong className="text-white">Allow</strong> when your browser asks for camera and microphone permissions.
              </p>
            </div>
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          </div>
        )}

        {stage === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-slate-300 font-medium">Connecting to video call...</p>
          </div>
        )}

        {stage === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-300 text-center max-w-sm">{error}</p>
            <div className="flex gap-3">
              <button onClick={requestPermissions} className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500">
                Try Again
              </button>
              <button onClick={handleLeave} className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
                Close
              </button>
            </div>
          </div>
        )}

        {/* Remote video - full screen */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover rounded-xl ${stage !== "connected" || !remoteJoined ? "hidden" : ""}`}
        />

        {/* Waiting for remote */}
        {stage === "connected" && !remoteJoined && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 font-medium">Waiting for other participant to join...</p>
          </div>
        )}

        {/* Local video PiP */}
        <div className={`absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-xl overflow-hidden border-2 border-slate-600 shadow-xl bg-slate-800 ${stage === "error" || stage === "permissions" ? "hidden" : ""}`}>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <VideoOff className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div className="absolute bottom-1 left-1 text-white text-xs bg-black/60 px-1.5 py-0.5 rounded">You</div>
        </div>

        <audio ref={remoteAudioRef} autoPlay />
      </div>

      {/* Controls */}
      {stage === "connected" && (
        <div className="flex items-center justify-center gap-4 py-5 bg-slate-800 border-t border-slate-700">
          <button onClick={toggleMic} title={micOn ? "Mute" : "Unmute"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${micOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}>
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          <button onClick={toggleCam} title={camOn ? "Turn off camera" : "Turn on camera"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${camOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"}`}>
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>
          <button onClick={handleLeave} title="Leave call"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors">
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}