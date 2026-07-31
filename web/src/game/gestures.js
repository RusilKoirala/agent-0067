// all the  gestrues for the game 

import { GAME_CONFIG } from "../constants/gameConfig.js"


// :D the wonderful 6-7 poses

export function parsePoseControls(landmarks, refs)  {
    const { headCenterXRef, headCenterZRef, playerXRef, playerDepthRef, currentStateRef} = refs;


    // all the important parts to know before just understanding 6-7 movement   
    const nose = landmarks[0];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];


    /* 
    calibrate for different points different 
    one is for head left or right gesture
    one is for 6-7 gesture
    */

    // exclude useless calls
    if (headCenterXRef.current === null) headCenterXRef = nose.x;
    if (headCenterZRef.current === null) headCenterZRef = nose.z;


    // head tilt 
    const headTilt = nose.x - headCenterXRef.current;
    if (headTilt < -GAME_CONFIG.TILT_THRESHOLD) {
        playerXRef = Math.min(GAME_CONFIG.CANVAS_WIDHT - 20, playerXRef.current +  GAME_CONFIG.PLAYER_MOVE_STEP);  
    }
    else if (headTilt > GAME_CONFIG.TILT_THRESHOLD){
        playerXRef.current = Math.max(20, playerXRef.current - GAME_CONFIG.PLAYER_MOVE_STEP);
    }


    // 6-77777 gesture 
    const midTorsoY = ((leftShoulder.y + rightShoulder.y) /2 + (leftHip.y + rightHip.y)/2 )/2;
    const bothHandsActive = leftWrist.y < midTorsoY&& rightWrist.y < midTorsoY;

    let shouldShoot = false;

    /* the logic works like this
    if ydiff means the height from left and right wrist at y axis is greature than switch threshold it will think it as 6-777 
    and this will allow it to showw  

    */
    if (bothHandsActive) {
        const yDiff = rightWrist.y - leftWrist.y;
        if (yDiff > GAME_CONFIG.GESTURE_SWITCH_THRESHOLD) {
            if (currentStateRef.current === 'RIGHT_HIGH') shouldShoot= true 
            currentStateRef.current = 'LEFT_HIGH';
        } else if  (yDiff< -GAME_CONFIG.GESTURE_SWITCH_THRESHOLD){
            if (currentStateRef.current === 'LEFT_HIGH') shouldShoot = true;
            currentStateRef.current = 'RIGHT_HIGH';
        }

    } 
    else {
        currentStateRef.current = 'NEUTRAL';
    }

    return { headTilt, headDepth , bothHandsActive, shouldShoot};
}