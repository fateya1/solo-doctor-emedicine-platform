"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, AlertCircle, Users } from "lucide-react";

interface VideoCallProps {
  token: string;
  roomUrl: string;
  onLeave: () => void;
  participantName: string;
}

export function VideoCall({ token, roomUrl, onLeave, participantName }: VideoCallProps) {
  const callRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [remoteJoined, setRemoteJoined] = useState(false);

  const leave = useCallback(async () => {
    try {
      if (callRef.current) {
        await callRef.current.leave();
        await callRef.current.destroy();
        callRef.current = null;
      }
    } catch {}
    onLeave();
  }, [onLeave]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // Dynamically import Daily to avoid SSR issues
        const { default: DailyIframe } = await import("@daily-co/daily-js");

        if (!mounted) return;

        const call = DailyIframe.createCallObject({
          audioSource: true,
          videoSource: true,
        });

        callRef.current = call;

        call.on("joining-meeting", () => {
          if (mounted) setLoading(true);
        });

        call.on("joined-meeting", (evt: any) => {
          if (!mounted) return;
          setJoined(true);
          setLoading(false);

          // Attach local video
          const local = call.participants().local;
          if (local?.videoTrack && localVideoRef.current) {
            localVideoRef.current.srcObject = new MediaStream([local.videoTrack]);
          }
        });

        call.on("participant-joined", (evt: any) => {
          if (!mounted) return;
          setRemoteJoined(true);
          attachRemoteParticipant(call, evt.participant);
        });

        call.on("participant-updated", (evt: any) => {
          if (!mounted || evt.participant.local) return;
          attachRemoteParticipant(call, evt.participant);
        });

        call.on("participant-left", () => {
          if (!mounted) return;
          setRemoteJoined(false);
          if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        });

        call.on("track-started", (evt: any) => {
          if (!mounted) return;
          if (evt.participant?.local) {
            if (evt.track.kind === "video" && localVideoRef.current) {
              const stream = localVideoRef.current.srcObject as MediaStream || new MediaStream();
              stream.addTrack(evt.track);
              localVideoRef.current.srcObject = stream;
            }
          } else {
            attachRemoteParticipant(call, evt.participant);
          }
        });

        call.on("left-meeting", () => {
          if (mounted) onLeave();
        });

        call.on("error", (e: any) => {
          if (!mounted) return;
          setError(e?.errorMsg ?? "Video call error. Please check camera/mic permissions.");
          setLoading(false);
        });

        await call.join({ url: roomUrl, token });

      } catch (err: any) {
        if (mounted) {
          setError(err?.message ?? "Failed to start video call. Please allow camera and microphone access.");
          setLoading(false);
        }
      }
    };

    const attachRemoteParticipant = (call: any, participant: any) => {
      if (!participant || participant.local) return;

      if (participant.videoTrack && remoteVideoRef.current) {
        const existing = remoteVideoRef.current.srcObject as MediaStream;
        if (existing) {
          existing.getVideoTracks().forEach(t => existing.removeTrack(t));
          existing.addTrack(participant.videoTrack);
        } else {
          remoteVideoRef.current.srcObject = new MediaStream([participant.videoTrack]);
        }
      }

      if (participant.audioTrack && remoteAudioRef.current) {
        const existing = remoteAudioRef.current.srcObject as MediaStream;
        if (existing) {
          existing.getAudioTracks().forEach(t => existing.removeTrack(t));
          existing.addTrack(participant.audioTrack);
        } else {
          remoteAudioRef.current.srcObject = new MediaStream([participant.audioTrack]);
        }
      }
    };

    init();

    return () => {
      mounted = false;
      if (callRef.current) {
        callRef.current.leave().catch(() => {});
        callRef.current.destroy().catch(() => {});
        callRef.current = null;
      }
    };
  }, [roomUrl, token, onLeave]);

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
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white font-semibold">SoloDoc Video Consultation</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Users className="w-4 h-4" />
          {remoteJoined ? "2 participants" : "Waiting for other participant..."}
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 p-4">

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-400" />
            <p className="text-slate-300">Connecting to video call...</p>
            <p className="text-slate-500 text-sm">Please allow camera and microphone access if prompted</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-red-300 text-center max-w-sm">{error}</p>
            <button
              onClick={onLeave}
              className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600"
            >
              Close
            </button>
          </div>
        )}

        {/* Remote video - full screen */}
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={`w-full h-full object-cover rounded-xl ${!remoteJoined || loading ? "hidden" : ""}`}
        />

        {/* Waiting for remote */}
        {joined && !remoteJoined && !loading && (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-300 font-medium">Waiting for other participant to join...</p>
            <p className="text-slate-500 text-sm">Share the appointment link with them</p>
          </div>
        )}

        {/* Local video - picture in picture */}
        {joined && (
          <div className="absolute bottom-4 right-4 w-36 h-28 sm:w-48 sm:h-36 rounded-xl overflow-hidden border-2 border-slate-600 shadow-xl bg-slate-800">
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
        )}

        {/* Hidden audio element for remote participant */}
        <audio ref={remoteAudioRef} autoPlay />
      </div>

      {/* Controls */}
      {joined && (
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