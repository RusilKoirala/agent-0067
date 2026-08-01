# 🎮 Six-Seven Gesture Guide

## How the Gesture Works

The "six-seven" shooting gesture alternates between raising your left hand higher and right hand higher - like switching between the numbers 6 and 7 in sign language.

## Step-by-Step Instructions

### 1. **Starting Position**
- Stand facing the camera
- Raise BOTH hands above your shoulders
- Keep your hands visible and in front of your body

### 2. **Left Hand High (State: LEFT_HIGH)**
- Raise your LEFT hand higher than your right
- Your right hand should be lower but still above shoulders
- You'll see a **cyan/blue line** connecting your wrists

### 3. **Right Hand High (State: RIGHT_HIGH)**
- Now raise your RIGHT hand higher than your left
- Your left hand should be lower but still above shoulders
- You'll see a **magenta/pink line** connecting your wrists

### 4. **Shooting**
- **Switch between these positions to shoot!**
- Left high → Right high = 🔫 SHOOT!
- Right high → Left high = 🔫 SHOOT!

## Visual Feedback Guide

### On-Screen Indicators:
- **Green dot** = Your nose (head tracking)
- **Cyan dot (bright)** = Left hand is active (above shoulders)
- **Magenta dot (bright)** = Right hand is active (above shoulders)
- **Gray dots** = Hands are down (inactive)
- **Colored line between hands** = Both hands detected, ready to shoot!
- **Confidence bar** = Shows how clear your gesture is
  - Green = Perfect! (70%+)
  - Yellow = Good (40-70%)
  - Red = Weak (below 40%)

### Status Messages:
- "Raise both hands up!" = Get into position
- "HANDS UP: LEFT_HIGH" = Left hand is higher
- "HANDS UP: RIGHT_HIGH" = Right hand is higher

## Tips for Accurate Detection

### ✅ DO:
- Keep your hands at least 6-8 inches apart vertically when switching
- Make exaggerated movements (the bigger, the better!)
- Keep both hands in camera view at all times
- Stand 3-5 feet from the camera
- Have good lighting on your upper body
- Make quick, deliberate switches between positions

### ❌ DON'T:
- Move hands too close together (won't detect the difference)
- Make tiny movements (threshold won't trigger)
- Move hands horizontally - it's all about VERTICAL difference
- Drop your hands below shoulder level
- Block one hand behind your body
- Make too-fast rapid switches (300ms cooldown prevents double-shots)

## Troubleshooting

### "Not shooting when I switch hands!"
- **Make the height difference bigger** - aim for 6-8 inches minimum
- Check the confidence bar - needs to be yellow/green
- Ensure both hands show bright colors (not gray)

### "Shooting too much/randomly!"
- You might be bouncing between positions
- Try holding each position for a full second before switching
- Make more deliberate, controlled movements

### "Hands not detected (gray dots)"
- Raise hands higher - they need to be above your shoulders
- Improve lighting
- Get closer to camera
- Make sure hands aren't blocked

### "Which hand should I start with?"
- Doesn't matter! Start with either hand high
- The first switch from your starting position will shoot
- Example: Start left-high, switch to right-high = SHOOT!

## Advanced Technique

**"The Wave"** - Most consistent method:
1. Start with left hand high
2. While keeping both hands up, smoothly switch to right hand high
3. Switch back to left high
4. Repeat in a wave-like motion

Think of it like alternating between conducting an orchestra with each hand!

## Technical Details

- **Threshold**: 0.15 normalized units (about 15% of your shoulder-to-hip height)
- **Cooldown**: 300ms between shots (prevents double-shooting)
- **Normalization**: Works the same regardless of your distance from camera
- **Detection**: Based on MediaPipe Pose landmarks (wrists, shoulders, hips)

---

**Pro tip for demos**: Practice in front of a mirror first to get the muscle memory down. Once you've got it, you can shoot without even looking at the screen!
