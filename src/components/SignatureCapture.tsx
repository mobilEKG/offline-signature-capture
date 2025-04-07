import React, { useEffect, useRef, useState } from "react";
import { removeWhiteBackground } from "../utils/imageUtils";

const SignatureCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(null);

  // Set up camera on mount
  useEffect(() => {
    // Request camera access (prefer rear camera for mobile)
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      .then(mediaStream => {
        setStream(mediaStream);
        // Set video source to stream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          // Important: play video on mobile without fullscreen
          videoRef.current.play().catch(err => {
            console.error("Video play error:", err);
          });
        }
      })
      .catch(err => {
        console.error("Camera access error:", err);
        setError("Could not access camera. Please ensure it's connected and permission is granted.");
      });

    // Cleanup: stop camera stream on component unmount to release camera
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Capture the current frame, remove background, and generate data URL
  const captureSignature = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to video frame size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    // Draw the current video frame onto the canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Process the image to remove white background
    removeWhiteBackground(ctx, canvas.width, canvas.height, 230);
    // Convert the cleaned canvas to a PNG data URL
    const dataUrl = canvas.toDataURL("image/png");
    setSignatureDataUrl(dataUrl);
  };

  // Download the signature image when user clicks download button
  const downloadSignature = () => {
    if (!signatureDataUrl) return;
    const link = document.createElement("a");
    link.href = signatureDataUrl;
    link.download = "signature.png";
    // Append to DOM and trigger click
    document.body.appendChild(link);
    link.click();
    // Cleanup
    document.body.removeChild(link);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Video stream preview */}
      {error ? (
        <p className="text-red-600 mb-4">{error}</p>
      ) : (
        <video 
          ref={videoRef} 
          className="w-full max-w-md bg-gray-300 rounded shadow mb-4" 
          autoPlay 
          playsInline  /* playsInline is important for iOS to allow inline playback */
        />
      )}

      {/* Capture button */}
      <button 
        onClick={captureSignature} 
        className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-500 mb-4"
      >
        Capture Signature
      </button>

      {/* Hidden canvas used for processing (not displayed to user) */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Display the captured signature image if available */}
      {signatureDataUrl && (
        <div className="flex flex-col items-center">
          <div className="bg-gray-200 p-4 rounded shadow mb-2">
            {/* Show the result with transparent background over gray */}
            <img 
              src={signatureDataUrl} 
              alt="Captured Signature" 
              className="max-w-md"
            />
          </div>
          <button 
            onClick={downloadSignature} 
            className="bg-green-600 text-white font-medium px-4 py-2 rounded hover:bg-green-500"
          >
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
};

export default SignatureCapture;
