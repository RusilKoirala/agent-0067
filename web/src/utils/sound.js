// sound effect manager for the game
class SoundManager {
  constructor() {
    this.sounds = {
      fire: null,
      playerHit: null,
      backgroundMusic: null,
    };
    this.loaded = false;
    
    this.lastPlayerHitAt = 0;
  }

  // load sound
  loadSounds() {
    try {
      this.sounds.fire = new Audio('/fire.mp3');
      this.sounds.playerHit = new Audio('/player_got_hit.mp3');
      this.sounds.backgroundMusic = new Audio('/background_game.mp3');


      this.sounds.fire.volume = 0.15;
      this.sounds.playerHit.volume = 0.20;
      this.sounds.backgroundMusic.volume = 0.05;
      this.sounds.backgroundMusic.loop = true;

      this.sounds.fire.load();
      this.sounds.playerHit.load();
      this.sounds.backgroundMusic.load();

      this.loaded = true;
      console.log('Sound effects loaded successfully');
    } catch (error) {
      console.warn('Could not load sound effects:', error);
    }
  }

  // play background music
  playBackgroundMusic() {
    if (!this.loaded || !this.sounds.backgroundMusic) {
      console.warn('Background music not loaded');
      return;
    }
    try {
     
      this.sounds.backgroundMusic.currentTime = 0;
      this.sounds.backgroundMusic.volume = 0.05; 

      const playPromise = this.sounds.backgroundMusic.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('🎵 Background music playing successfully');
          })
          .catch(err => {
            console.error('Background music playback failed:', err);
            console.log('This might be due to browser autoplay policy. User interaction is required.');
          });
      }
    } catch (error) {
      console.error('Error playing background music:', error);
    }
  }

  // stop background music
  stopBackgroundMusic() {
    if (this.sounds.backgroundMusic) {
      this.sounds.backgroundMusic.pause();
      this.sounds.backgroundMusic.currentTime = 0;
 
    }
  }

  // play fire sound (ONLYYY when enemy gets hit)
  playFire() {
    if (!this.loaded || !this.sounds.fire) {
      console.warn('Fire sound not loaded');
      return;
    }
    try {

      const sound = this.sounds.fire.cloneNode();
      sound.volume = 0.15; 
      sound.play().catch(err => console.warn('Fire sound playback failed:', err));
    } catch (error) {
      console.warn('Error playing fire sound:', error);
    }
  }


  playPlayerHit() {
    if (!this.loaded || !this.sounds.playerHit) {
      console.warn('Player hit sound not loaded');
      return;
    }
    const now = performance.now();
    if (now - this.lastPlayerHitAt < 250) {

      return;
    }
    this.lastPlayerHitAt = now;
    try {
      const sound = this.sounds.playerHit.cloneNode();
      sound.volume = 0.20;
      sound.play().catch(err => console.warn('Player hit sound playback failed:', err));
    } catch (error) {
      console.warn('Error playing player hit sound:', error);
    }
  }
}


export const soundManager = new SoundManager();
