// all the gestures for the game 

import { GAME_CONFIG } from "../constants/gameConfig.js"


export function parsePoseControls(landmarks, refs) {
    const { headCenterXRef, playerXRef, currentStateRef, lastShootTimeRef } = refs;

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

    /// find the deltaaa what changed 
    const headTilt = nose.x - headCenterXRef.current;
    
    /*
        head left goes left
        head right goes right
    */
    if (headTilt < -GAME_CONFIG.TILT_THRESHOLD) {
        const moveAmount = Math.min(GAME_CONFIG.PLAYER_MOVE_STEP, Math.abs(headTilt) * 200);
        playerXRef.current = Math.min(GAME_CONFIG.CANVAS_WIDTH - 20, playerXRef.current + moveAmount);
    } else if (headTilt > GAME_CONFIG.TILT_THRESHOLD) {
        const moveAmount = Math.min(GAME_CONFIG.PLAYER_MOVE_STEP, Math.abs(headTilt) * 200);
        playerXRef.current = Math.max(20, playerXRef.current - moveAmount);
    }

    // ===== IMPROVED SIX-SEVEN GESTURE DETECTION =====
    
    // Calculate shoulder height (for normalization based on body size)
    const shoulderHeight = Math.abs(leftShoulder.y - leftHip.y);
    
    // Calculate mid-torso reference point (between shoulders and hips)
    const midTorsoY = ((leftShoulder.y + rightShoulder.y) / 2 + (leftHip.y + rightHip.y) / 2) / 2;
    
    // Hands are "active" if BOTH wrists are above mid-torso
    const leftHandActive = leftWrist.y < midTorsoY;
    const rightHandActive = rightWrist.y < midTorsoY;
    const bothHandsActive = leftHandActive && rightHandActive;

    let shouldShoot = false;
    let gestureConfidence = 0;

    if (bothHandsActive) {
        // Calculate vertical difference between wrists (NORMALIZED by shoulder height)
        // This makes the gesture work the same regardless of distance from camera
        const rawYDiff = rightWrist.y - leftWrist.y;
        const normalizedYDiff = rawYDiff / shoulderHeight;
        
        // Calculate absolute difference for confidence scoring
        gestureConfidence = Math.min(1, Math.abs(normalizedYDiff) / 0.3);
        
        // Determine which hand is higher
        const leftIsHigher = normalizedYDiff > GAME_CONFIG.GESTURE_SWITCH_THRESHOLD;
        const rightIsHigher = normalizedYDiff < -GAME_CONFIG.GESTURE_SWITCH_THRESHOLD;
        
        // Debounce: Only shoot if enough time has passed since last shot
        const now = Date.now();
        const timeSinceLastShot = lastShootTimeRef.current ? now - lastShootTimeRef.current : 1000;
        const canShootAgain = timeSinceLastShot > 300; // 300ms cooldown
        
        if (canShootAgain) {
            if (leftIsHigher && currentStateRef.current === 'RIGHT_HIGH') {
                // Switched from right-high to left-high = SHOOT!
                shouldShoot = true;
                lastShootTimeRef.current = now;
                console.log('🎯 LEFT-HIGH SHOOT! (normalized diff:', normalizedYDiff.toFixed(3), ')');
            } else if (rightIsHigher && currentStateRef.current === 'LEFT_HIGH') {
                // Switched from left-high to right-high = SHOOT!
                shouldShoot = true;
                lastShootTimeRef.current = now;
                console.log('🎯 RIGHT-HIGH SHOOT! (normalized diff:', normalizedYDiff.toFixed(3), ')');
            }
        }
        
        // Update current state
        if (leftIsHigher) {
            currentStateRef.current = 'LEFT_HIGH';
        } else if (rightIsHigher) {
            currentStateRef.current = 'RIGHT_HIGH';
        }
        // If hands are level, keep previous state
        
    } else {
        // Hands not both up - reset to neutral
        currentStateRef.current = 'NEUTRAL';
    }

    return { 
        headTilt, 
        bothHandsActive, 
        shouldShoot,
        gestureConfidence,
        leftHandActive,
        rightHandActive,
        currentGestureState: currentStateRef.current
    };
}