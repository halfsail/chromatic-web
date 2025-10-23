import { gameData } from '../state/Store.svelte';

// Sound effects
let audioContext = null;
let sounds = {};
let audioContextInitialized = false;

// Initialize sounds after user interaction
export function initializeSounds() {
    if (audioContextInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load all sound files
        const soundFiles = {
            tap: './audio/pop_down.mp3',
            cellClick: './audio/lock.ogg',
            cellMove: './audio/lock_48k.ogg',
            cellHover: './audio/lock.ogg',
            win: './audio/kirakira.mp3',
        };

        // Create a promise for each sound file
        const loadPromises = Object.entries(soundFiles).map(async ([key, url]) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                sounds[key] = audioBuffer;
            } catch (err) {
                console.warn(`Failed to load sound ${key}:`, err);
            }
        });

        // Wait for all sounds to load
        Promise.all(loadPromises).then(() => {
            audioContextInitialized = true;
        });
    } catch (err) {
        console.warn('Failed to initialize audio context:', err);
    }
}

// Test function to verify vibration
export function testVibration() {
    if (!navigator.vibrate) {
        console.warn('Vibration API not supported');
        return false;
    }
    
    // Try a simple 500ms vibration
    const success = navigator.vibrate(500);
    console.log('Vibration test result:', success);
    return success;
}

// Haptic patterns
const haptics = {
    tap: {
        pattern: 50, // Single 50ms vibration
        intensity: 2
    },
    cellClick: {
        pattern: 30, // Single 50ms vibration
        intensity: 1
    },
    cellMove: {
        pattern: 70, // Single 70ms vibration
        intensity: 2
    },
    cellHover: {
        pattern: 20, // Single 20ms vibration
        intensity: 1
    },
    move: {
        pattern: 100, // Single 100ms vibration
        intensity: 1
    },
    back: {
        pattern: 100, // Single 100ms vibration
        intensity: 1
    },
    win: {
        pattern: [40,30,40,30,40], // Simple pattern
        intensity: 1.0
    },
    error: {
        pattern: 200, // Single 200ms vibration
        intensity: 0.3
    }
};

export function playFeedback(type) {
    // Initialize sounds if not already done
    if (!audioContextInitialized) {
        initializeSounds();
        console.log(type)
    }

    // Play sound if available
    if (sounds[type] && gameData.settings.soundEnabled === true && audioContext) {
        try {
            const source = audioContext.createBufferSource();
            source.buffer = sounds[type];
            source.connect(audioContext.destination);
            source.start(0);
        } catch (err) {
            console.warn('Sound playback failed:', err);
        }
    }

    // Play haptic feedback if available
    if (gameData.settings.hapticEnabled === true) {
        try {
            // Check if vibration is supported
            if (!navigator.vibrate) {
                console.warn('Vibration API not supported on this device/browser');
                return;
            }

            // Get the pattern for this feedback type
            const pattern = haptics[type]?.pattern;
            if (!pattern) {
                console.warn(`No haptic pattern defined for type: ${type}`);
                return;
            }

            // Log the vibration attempt
            console.log(`Attempting to vibrate with pattern:`, pattern);

            // Try to vibrate
            const success = navigator.vibrate(pattern);
            
            if (!success) {
                console.warn('Vibration was rejected by the device');
            }
        } catch (err) {
            console.warn('Haptic feedback failed:', err);
        }
    }
} 