import React, { useState, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff, Shield, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';

export const VideoCallRoom: React.FC = () => {
  const [inCall, setInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Call duration timer simulation
  useEffect(() => {
    let timer: any;
    if (inCall) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [inCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setInCall(true);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
  };

  const handleEndCall = () => {
    setInCall(false);
    setIsScreenSharing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nexus Collaboration Room</h1>
        <p className="text-gray-600">Secure WebRTC Peer-to-Peer encrypted video calling pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Video Screen Stream Layout */}
        <div className="lg:col-span-3 space-y-4">
          <div className="relative bg-gray-950 aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-800 flex items-center justify-center">
            
            {inCall ? (
              <>
                {/* Simulated Remote Stream Container (Investor / Founder Feed) */}
                {isScreenSharing ? (
                  <div className="absolute inset-0 bg-indigo-950 flex flex-col items-center justify-center text-white p-4 text-center">
                    <Monitor size={48} className="text-indigo-400 animate-pulse mb-3" />
                    <p className="font-semibold text-lg">You are sharing your desktop screen...</p>
                    <p className="text-sm text-indigo-200">System audio & responsive presentation tabs are active.</p>
                  </div>
                ) : (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950">
                    <div className="text-center text-white space-y-2">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto text-2xl font-bold border-2 border-white shadow-md animate-bounce">
                        NX
                      </div>
                      <p className="text-lg font-medium">Remote Participant Stream Active</p>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        HD 1080p Connected
                      </span>
                    </div>
                  </div>
                )}

                {/* Local Picture-in-Picture Self Feed */}
                <div className="absolute bottom-4 right-4 w-40 sm:w-48 aspect-video bg-gray-900 rounded-lg border-2 border-gray-700 shadow-xl overflow-hidden z-10 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="text-gray-500 text-xs flex flex-col items-center">
                      <VideoOff size={18} className="mb-1" />
                      <span>Camera Off</span>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-gray-300 text-xs font-mono p-2 text-center">
                      [Your Video Feed]
                    </div>
                  )}
                  <div className="absolute bottom-1 left-2 bg-black/60 px-1 rounded text-[10px] text-white">
                    You {isMuted && '🎤 Muted'}
                  </div>
                </div>

                {/* Live Call Badges */}
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-semibold tracking-wider animate-pulse flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white"></span> LIVE
                  </span>
                  <span className="bg-black/60 text-white px-3 py-1 rounded-md text-xs font-mono">
                    {formatTime(callDuration)}
                  </span>
                </div>
              </>
            ) : (
              /* Call Pre-join Screen Placeholder */
              <div className="text-center text-gray-400 max-w-sm px-6">
                <Video size={48} className="mx-auto mb-4 text-gray-600" />
                <h3 className="text-lg font-medium text-white mb-1">Ready to Join Pitch Session?</h3>
                <p className="text-sm text-gray-500 mb-6">Verify your peripheral audio and hardware modules before standard authentication.</p>
                <Button variant="primary" className="w-full shadow-lg" onClick={handleStartCall}>
                  Start Live Consultation
                </Button>
              </div>
            )}
          </div>

          {/* Live Audio/Video Action Control Utility Bar */}
          {inCall && (
            <div className="flex flex-wrap justify-center items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Button
                variant={isMuted ? 'danger' : 'outline'}
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                leftIcon={isMuted ? <MicOff size={18} /> : <Mic size={18} />}
              >
                {isMuted ? 'Unmute Mic' : 'Mute'}
              </Button>

              <Button
                variant={isVideoOff ? 'danger' : 'outline'}
                size="sm"
                onClick={() => setIsVideoOff(!isVideoOff)}
                leftIcon={isVideoOff ? <VideoOff size={18} /> : <Video size={18} />}
              >
                {isVideoOff ? 'Turn Camera On' : 'Stop Video'}
              </Button>

              <Button
                variant={isScreenSharing ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setIsScreenSharing(!isScreenSharing)}
                leftIcon={<Monitor size={18} />}
              >
                {isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </Button>

              <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>

              <Button
                variant="danger"
                size="sm"
                className="bg-red-600 hover:bg-red-700 font-medium"
                onClick={handleEndCall}
                leftIcon={<PhoneOff size={18} />}
              >
                Disconnect Call
              </Button>
            </div>
          )}
        </div>

        {/* Sidebar Info Section */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Shield size={16} className="text-indigo-600" /> Room Security Details
              </h3>
            </CardHeader>
            <CardBody className="text-xs space-y-3 text-gray-600">
              <p>This session uses premium point-to-point secure WebRTC protocols[cite: 28]. No stream logs are intercepted globally.</p>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                <strong>Signal ID:</strong> nxs_wrtc_78249_sec
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-1.5">
                <Users size={16} className="text-indigo-600" /> Active Roster
              </h3>
            </CardHeader>
            <CardBody className="text-xs space-y-2">
              <div className="flex items-center justify-between p-1.5 bg-emerald-50 rounded border border-emerald-100 text-emerald-950">
                <span>You (Local Peer)</span>
                <span className="font-semibold text-[10px]">HOST</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-gray-50 rounded border border-gray-100 text-gray-500 italic">
                <span>{inCall ? 'Remote Investor (Connected)' : 'Waiting for Guest Token...'}</span>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};