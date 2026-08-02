// all the gestures for the game 

import { GAME_CONFIG } from "../constants/gameConfig.js"


export function parsePoseControls(landmarks, refs) {
    const { headCenterXRef, playerXRef, currentStateRef } = refs;

    // landmaarks got from mediapipe pose detection (JUST AMAZING SO EZZZ)
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    // just finding data
    if (headCenterXRef.current === null) {
        headCenterXRef.current = nose.x;
    }

    // movement should feel symmetric on both sides instead of being "step-based"
    // and more sensitive when turning right.
    const headTilt = nose.x - headCenterXRef.current;
    const deadZone = GAME_CONFIG.TILT_THRESHOLD;

    if (Math.abs(headTilt) > deadZone) {
        const movementScale = 180;
        const movement = headTilt * movementScale;
        playerXRef.current = Math.min(
            GAME_CONFIG.CANVAS_WIDTH - 20,
            Math.max(20, playerXRef.current + movement)
        );
    }

    // SIX-SEVEN for pew pew
    const midTorsoY = ((leftShoulder.y + rightShoulder.y) / 2 + (leftHip.y + rightHip.y) / 2) / 2;
    const bothHandsActive = leftWrist.y < midTorsoY && rightWrist.y < midTorsoY;

    let shouldShoot = false;

    if (bothHandsActive) {
        const yDiff = rightWrist.y - leftWrist.y;
        

        if (yDiff > GAME_CONFIG.GESTURE_SWITCH_THRESHOLD) {
            if (currentStateRef.current === 'RIGHT_HIGH') {
                shouldShoot = true;
            }
            currentStateRef.current = 'LEFT_HIGH';
        } 
        
        else if (yDiff < -GAME_CONFIG.GESTURE_SWITCH_THRESHOLD) {
            if (currentStateRef.current === 'LEFT_HIGH') {
                shouldShoot = true;
            }
            currentStateRef.current = 'RIGHT_HIGH';
        }
    } else {
        currentStateRef.current = 'NEUTRAL';
    }

    return { headTilt, bothHandsActive, shouldShoot };
}