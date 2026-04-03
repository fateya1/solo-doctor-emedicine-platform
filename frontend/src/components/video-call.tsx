"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Loader2, AlertCircle } from "lucide-react";

interface VideoCallProps {
  token: string;
  roomUrl: string;
  onLeave: () => void;
  participantName: string;
}

export function VideoCall({ token, roomUrl, onLeave, participantName }: VideoCallProps) {
  const callRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [participants, setParticipants] = useState<Record<string, any>>({});

  const leave = useCallback(async () => {
    if (callRef.current) {
      await callRef.current.leave();
      await callRef.current.destroy();
      callRef.current = null;
    }
    onLeave();
  }, [onLeave]);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const DailyIframe = (await import("@daily-co/daily-js")).default;

        if (!mounted || !containerRef.current) return;

        const call = DailyIframe.createCallObject({
          audioSource: true,
          videoSource: true,
        });

        callRef.current = call;

        call.on("joining-meeting", () => mounted && setLoading(true));
        call.on("joined-meeting", () => {
          if (!mounted) return;
          setJoined(true);
          setLoading(false);
        });
        call.on("left-meeting", () => mounted && onLeave());
        call.on("error", (e: any) => {
          if (!mounted) return;
          setError(e?.errorMsg ?? "Video call error occurred");
          setLoading(false);
        });
        call.on("participant-joined", () => {
          if (!mounted) return;
          setParticipants({ ...call.participants() });
        });
        call.on("participant-left", () => {
          if (!mounted) return;
          setParticipants({ ...call.participants() });
        });
        call.on("participant-updated", () => {
          if (!mounted) return;
          setParticipants({ ...call.participants() });
        });

        await call.join({ url: roomUrl, token });

        // Attach video tiles
        const attachTiles = () => {
          if (!containerRef.current) return;
          const allParticipants = call.participants();

          Object.values(allParticipants).forEach((p: any) => {
            const existingEl = document.getElementById(`tile-${p.session_id}`);
            if (existingEl) return;

            const wrapper = document.createElement("div");
            wrapper.id = `tile-${p.session_id}`;
            wrapper.className = "relative rounded-xl overflow-hidden bg-slate-800 aspect-video";

            const nameTag = document.createElement("div");
            nameTag.className = "absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded";
            nameTag.textContent = p.local ? participantName : (p.user_name ?? "Participant");

            wrapper.appendChild(nameTag);
            containerRef.current!.appendChild(wrapper);

            if (p.videoTrack) {
              const videoEl = document.createElement("video");
              videoEl.srcObject = new MediaStream([p.videoTrack]);
              videoEl.autoplay = true;
              videoEl.muted = p.local;
              videoEl.className = "w-full h-full object-cover";
              wrapper.insertBefore(videoEl, nameTag);
            }

            if (p.audioTrack && !p.local) {
              const audioEl = document.createElement("audio");
              audioEl.srcObject = new MediaStream([p.audioTrack]);
              audioEl.autoplay = true;
              wrapper.appendChild(audioEl);
            }
          });
        };

        call.on("track-started", attachTiles);
        call.on("participant-joined", attachTiles);

      } catch (err: any) {
        if (mounted) {
          setError(err.message ?? "Failed to initialize video call");
          setLoading(false);
        }
      }
    };

    init();
    return () => {
      mounted = false;
      if (callRef.current) {
        callRef.current.leave().catch(() => {});
        callRef.current.destroy().catch(() => {});
      }
    };
  }, [roomUrl, token, participantName, onLeave]);

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

  const participantCount = Object.keys(participants).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-white font-semibold">SoloDoc Video Consultation</span>
        </div>
        <div className="text-slate-400 text-sm">
          {participantCount} participant{participantCount !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Video area */}
      <div className="flex-1 overflow-hidden p-4">
        {loading && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-brand-400" />
            <p className="text-slate-300">Connecting to video call...</p>
          </div>
        )}

        {error && (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
            <p className="text-red-300 text-center max-w-sm">{error}</p>
            <button onClick={onLeave} className="px-6 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600">
              Close
            </button>
          </div>
        )}

        {!loading && !error && (
          <div
            ref={containerRef}
            className="h-full grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
          />
        )}
      </div>

      {/* Controls */}
      {joined && (
        <div className="flex items-center justify-center gap-4 py-6 bg-slate-800 border-t border-slate-700">
          <button
            onClick={toggleMic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              micOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
            title={micOn ? "Mute" : "Unmute"}
          >
            {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleCam}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              camOn ? "bg-slate-600 hover:bg-slate-500 text-white" : "bg-red-600 hover:bg-red-500 text-white"
            }`}
            title={camOn ? "Turn off camera" : "Turn on camera"}
          >
            {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={leave}
            className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
            title="Leave call"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}
