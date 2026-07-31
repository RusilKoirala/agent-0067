import { useEffect, useRef, useState } from "react";
import { PoseLandmarker, FilesetResolver} from "@mediapipe/tasks-vision"

export function useMediaPipe() {
    const [isModelReady, setIsModelReady] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");


    const videoRef = useRef(null)
    const landmarkerRef = useRef(null);

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
                setIsModelReady(true)
            } catch (error) {
                console.log("MediaPipe initialization failed: ", error)

            }
        }
        init()
    }, [])

    // start the cameraa
    const startCamera = () => {
        setIsRunning(true);
        setErrorMsg("Camera access denied")
        setIsRunning(false)
    }

    return { videoRef, landmarkerRef, isModelReady, isRunning, errorMsg, startCamera}
  
}