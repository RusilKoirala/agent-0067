
// all the game constants like different constants
/*
guys pls dont change the following values
*/
export const GAME_CONFIG = {

    // layout
    CANVAS_WIDTH:  800,
    CANVAS_HEIGHT: 600,

    // game duration (60 sec makess itt funn YAYYY)
    GAME_DURATION_SEC : 60,

    // control things
    TILT_THRESHOLD: 0.03,  // like if i tilt my head until when dont move right for tose dummies  who is reading my shit code 
    GESTURE_SWITCH_THRESHOLD: 0.15, // normalized threshold for 6-7 gesture (increased for better accuracy)

    // speed 
    PLAYER_SPEED: 8,
    PLAYER_MOVE_STEP: 5,  // reduced for smoother movement
    BULLET_SPEED: 10,

    // enemy spawning
    ENEMY_SPAWN_INTERVAL_MS: 1000, // spawn enemy every 1 second

    // hitbox 
    COLLISION_X_DIST: 40,
    COLLISION_Y_DIST: 30,
}