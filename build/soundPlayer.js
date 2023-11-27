export class SoundPlayer {
    constructor(volume = 1.0, poolSize = 3) {
        this.volume = volume;
        this.poolSize = poolSize;
        this.audioPools = {};
    }
    createAudioElement(audioPath) {
        const audio = new Audio(audioPath);
        audio.volume = this.volume;
        audio.addEventListener('ended', () => {
            this.audioPools[audioPath].push(audio);
        });
        return audio;
    }
    add(audioPath) {
        if (!this.audioPools[audioPath]) {
            this.audioPools[audioPath] = [];
            for (let i = 0; i < this.poolSize; i++) {
                const audio = this.createAudioElement(audioPath);
                this.audioPools[audioPath].push(audio);
            }
        }
    }
    setVolume(volume) {
        this.volume = volume;
        Object.values(this.audioPools).forEach((audioPool) => {
            audioPool.forEach((audio) => {
                audio.volume = volume;
            });
        });
    }
    play(audioPath) {
        const audioPool = this.audioPools[audioPath];
        if (!audioPool || audioPool.length === 0) {
            console.error(`No available pool for sound: ${audioPath}`);
            return;
        }
        const audio = audioPool.pop();
        if (audio) {
            audio.play();
        }
    }
    playAll() {
        Object.values(this.audioPools).forEach((audioPool) => {
            if (audioPool.length > 0) {
                const audio = audioPool.pop();
                if (audio) {
                    audio.play();
                }
            }
        });
    }
    stopAll() {
        Object.values(this.audioPools).forEach((audioPool) => {
            audioPool.forEach((audio) => {
                audio.pause();
                audio.currentTime = 0;
            });
        });
    }
}
