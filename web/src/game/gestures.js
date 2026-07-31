// all the  gestrues for the game 

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



    
}