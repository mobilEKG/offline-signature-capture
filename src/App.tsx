import React from "react";
import SignatureCapture from "./components/SignatureCapture";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      {/* Instructional prompt */}
      <h1 className="text-2xl font-semibold mb-2 text-center">Offline Signature Capture</h1>
      <p className="mb-4 text-center text-gray-700">
        Please sign your name on a white paper and hold it up to the camera. 
        Press <strong>Capture</strong> to take a photo, then download the cleaned signature.
      </p>

      {/* Signature capture component */}
      <SignatureCapture />
    </div>
  );
};

export default App;
