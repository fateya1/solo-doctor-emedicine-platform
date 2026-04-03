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

export function VideoCall({ token, roomUrl, onLeave, participantName }: VideoCallProps) {
  const callRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [stage, setStage] = useState<Stage>("permissions");
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteJoined, setRemoteJoined] = useState(false);

  const leave = useCallback(async () => {
    try {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      if (callRef.current) {
        await callRef.current.leave();
        await callRef.current.destroy();
        callRef.current = null;
      }
    } catch {}
    onLeave();
  }, [onLeave]);

  // Step 1: Request permissions first, show local preview
  const requestPermissions = useCallback(async () => {
    setStage("permissions");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      // Permissions granted — now join the call
      joinCall(stream);
    } catch (err: any) {
      setError(
        err?.name === "NotAllowedError"
          ? "Camera and microphone access was denied. Please allow access in your browser settings and try again."
          : err?.name === "NotFoundError"
          ? "No camera or microphone found. Please connect a device and try again."
          : "Could not access camera/microphone: " + (err?.message ?? "Unknown error")
      );
      setStage("error");
    }
  }, []);

  // Step 2: Join Daily room after permissions granted
  const joinCall = useCallback(async (stream: MediaStream) => {
    setStage("connecting");
    try {
      const { default: DailyIframe } = await import("@daily-co/daily-js");

      const videoTrack = stream.getVideoTracks()[0];
      const audioTrack = stream.getAudioTracks()[0];

      const call = DailyIframe.createCallObject({
        videoSource: videoTrack,
        audioSource: audioTrack,
      });

      callRef.current = call;

      call.on("joined-meeting", () => {
        setStage("connected");
        const local = call.participants().local;
        if (local?.videoTrack && localVideoRef.current) {
          localVideoRef.current.srcObject = new MediaStream([local.videoTrack]);
        }
      });

      call.on("participant-joined", (evt: any) => {
        setRemoteJoined(true);
        attachRemote(evt.participant);
      });

      call.on("participant-updated", (evt: any) => {
        if (evt.participant.local) return;
        attachRemote(evt.participant);
      });

      call.on("track-started", (evt: any) => {
        if (!evt.participant.local) attachRemote(evt.participant);
      });

      call.on("participant-left", () => {
        setRemoteJoined(false);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
      });

      call.on("left-meeting", () => onLeave());

      call.on("error", (e: any) => {
        setError(e?.errorMsg ?? "Video call error occurred.");
        setStage("error");
      });

      await call.join({ url: roomUrl, token });

    } catch (err: any) {
      setError(err?.message ?? "Failed to connect to video call.");
      setStage("error");
    }
  }, [roomUrl, token, onLeave]);

  const attachRemote = (participant: any) => {
    if (!participant || participant.local) return;
    if (participant.videoTrack && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = new MediaStream([participant.videoTrack]);
    }
    if (participant.audioTrack && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = new MediaStream([participant.audioTrack]);
    }
  };

  // Auto-request permissions on mount
  useEffect(() => {
    requestPermissions();
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (callRef.current) {
        callRef.current.leave().catch(() => {});
        callRef.current.destroy().catch(() => {});
      }
    };
  }, []);

  const toggleMic = async () => {
    if (!callRef.current) return;
    await callRef.current.setLocalAudio(!micOn);
    setMicOn(!micOn);
  };

  const toggleCam = async () => {
    if (!callRef.current) return;
    await callRef.current.setLocalVideo(!camOn);
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

        {/* Permissions stage */}
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

        {/* Connecting stage */}
        {stage === "connecting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-slate-300 font-medium">Connecting to video call...</p>
          </div>
        )}

        {/* Error stage */}
        {stage === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 p-6">
            <AlertCircle className="w-12 h-12 text-red-400" />
            <p className="text-red-300 text-center max-w-sm">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={requestPermissions}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500"
              >
                Try Again
              </button>
              <button
                onClick={onLeave}
                className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Remote video */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover rounded-xl ${stage !== "connected" || !remoteJoined ? "hidden" : ""}`}
        />

        {/* Waiting for remote participant */}
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
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!camOn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <VideoOff className="w-6 h-6 text-slate-400" />
            </div>
          )}
          <div className="absolute bottom-1 left-1 text-white text-xs bg-black/60 px-1.5 py-0.5 rounded">
            You
          </div>
        </div>

        <audio ref={remoteAudioRef} autoPlay />
      </div>

      {/* Controls - only show when connected */}
      {stage === "connected" && (
        <div className="flex items-center justify-center gap-4 py-5 bg-slate-800 border-t border-slate-700">
          <button
            onClick={toggleMic}
            title={micOn ? "Mute" : "Unmute"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              micOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCam}
            title={camOn ? "Turn off camera" : "Turn on camera"}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              camOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
          >
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={leave}
            title="Leave call"
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}