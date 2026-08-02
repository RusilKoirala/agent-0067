import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver} from "@mediapipe/tasks-vision"

export function useMediaPipe() {
    const [isModelReady, setIsModelReady] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const videoRef = useRef(null)
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    useEffect(()=> {

        // this function runs as soon as player comes into game
        async function init() {
            try {

                // source : https://www.npmjs.com/package/@mediapipe/tasks-vision i got from there
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
                )

                // get the land marked google's trained dataa 
                landmarkerRef.current = await PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "/pose_landmarker_heavy.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numPoses: 1
                });
                setIsModelReady(true);
                console.log("mediapipe model loaded successfully");
            } catch (error) {
                console.error("MediaPipe initialization failed: ", error);
                setErrorMsg("failed to load pose detection model");

            }
        }
        init()
    }, [])

    useEffect(() => {
        if (!isRunning || !videoRef.current || !streamRef.current) return;

        const video = videoRef.current;
        video.srcObject = streamRef.current;
        video.muted = true;
        video.playsInline = true;

        video.play().catch(() => {
            console.warn('video play() was blocked before the stream was attached');
        });
    }, [isRunning]);

    // start the cameraa
    const startCamera = async () => {
        try {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: 1280,
                    height: 720,
                    facingMode: 'user'
                }
            });

            streamRef.current = stream;
            setIsRunning(true);
            setErrorMsg("");
        } catch (error) {
            console.error("camera access failed:", error);
            setErrorMsg("Camera access denied. Please allow camera permissions.");
            setIsRunning(false);
        }
    }

    return { videoRef, landmarkerRef, isModelReady, isRunning, errorMsg, startCamera }
  
}