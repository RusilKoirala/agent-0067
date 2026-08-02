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

    // keep a calibrated center so both left and right turns are compared against the same baseline
    if (headCenterXRef.current === null) {
        headCenterXRef.current = nose.x;
    }

    // move based on the nose offset from its resting center position
    const headTilt = nose.x - headCenterXRef.current;

    if (headTilt < -GAME_CONFIG.TILT_THRESHOLD) {
        playerXRef.current = Math.min(GAME_CONFIG.CANVAS_WIDTH - 20, playerXRef.current + GAME_CONFIG.PLAYER_MOVE_STEP);
    } else if (headTilt > GAME_CONFIG.TILT_THRESHOLD) {
        playerXRef.current = Math.max(20, playerXRef.current - GAME_CONFIG.PLAYER_MOVE_STEP);
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