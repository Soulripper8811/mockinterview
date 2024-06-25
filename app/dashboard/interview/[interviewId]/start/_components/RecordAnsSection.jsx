"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../../../../../../components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";

function RecordAnsSection() {
  const [userAnswer, setUserAnswer] = useState("");
  const [hasPermission, setHasPermission] = useState(true);
  const isWebcamSupported =
    typeof navigator !== "undefined" && !!navigator.mediaDevices?.getUserMedia;
  const isSpeechRecognitionSupported =
    typeof window !== "undefined" && !!window.SpeechRecognition;

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });
  useEffect(() => {
    if (results) {
      results.map((result) =>
        setUserAnswer((prevAns) => prevAns + result?.transcript)
      );
    }
  }, [results]);
  useEffect(() => {
    // Check webcam permissions
    if (isWebcamSupported) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));
    } else {
      setHasPermission(false);
    }
  }, [isWebcamSupported]);
  if (!isWebcamSupported || !isSpeechRecognitionSupported) {
    return (
      <div>Sorry, your browser does not support the required features.</div>
    );
  }

  if (!hasPermission) {
    return <div>Camera access denied. Please enable camera permissions.</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col my-20 justify-center items-center rounded-lg p-5">
        <Image src={"/webcam.png"} width={200} height={200} />
        <Webcam
          className="absolute"
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>
      <Button
        className={"my-10"}
        variant={"outline"}
        onClick={isRecording ? stopSpeechToText : startSpeechToText}
      >
        {isRecording ? (
          <h2 className="text-red-600 gap-2 flex">
            <Mic />
            Stop Recording...
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>
      <Button onClick={() => console.log(userAnswer)}> Show User Answer</Button>
    </div>
  );
}

export default RecordAnsSection;
