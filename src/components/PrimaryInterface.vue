<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { Settings, Play, Sun, Moon, Map, Book, X, CircleDot, Mic, MicOff } from 'lucide-vue-next';
import Orb from './Orb.vue';
import { i18n, theme, toggleTheme, activeModel, setModel } from '../services/i18n';

const props = defineProps({
  user: Object,
  isListening: Boolean,
  isProcessing: Boolean,
  lastAudioUrl: String
});

const emit = defineEmits(['toggleVoice', 'viewDiscovery', 'viewAiMap', 'viewMemos', 'textInput']);

const textInputValue = ref('');
const showSettings = ref(false);
const recordingTime = ref(0);
const sessionLimit = 60; // 1-minute success habit
let timerInterval = null;

const handleOrbClick = () => {
    emit('toggleVoice');
};

const handleTextSubmit = () => {
    if (!textInputValue.value) return;
    emit('textInput', textInputValue.value);
    textInputValue.value = '';
};

watch(() => props.isListening, (newVal) => {
    if (newVal) {
        recordingTime.value = 0;
        timerInterval = setInterval(() => {
            recordingTime.value++;
            // Hard auto-stop is handled by the composable, 
            // but we sync UI feedback here if needed.
        }, 1000);
    } else {
        clearInterval(timerInterval);
    }
});
</script>

<template>
  <div class="tive-root" :class="{ 'light-mode': theme === 'light', 'is-recording': isListening }">
    
    <!-- 🌊 Mimamori Peripheral Pulse (Outdoor Navigation Aid) -->
    <div v-if="isListening" class="mimamori-aura"></div>

    <header class="tive-header">
      <div class="tive-branding">
        <div class="tive-dot-logo" :class="{ 'is-active': isListening || isProcessing }"></div>
        <span class="tive-brand-text">Tive◎Core</span>
      </div>
      
      <div class="nav-icons">
        <button v-if="!isListening" class="status-indicator" @click="$emit('viewMemos')">
            <Book :size="14" class="mr-1" />
            <span>Archive</span>
        </button>
        <button class="icon-btn" @click="toggleTheme">
            <component :is="theme === 'dark' ? Sun : Moon" :size="20" />
        </button>
      </div>
    </header>

    <main class="tive-main" :class="{ 'focus-mode': isListening }">
        <div v-if="!isListening" class="hero-section animate-in fade-in duration-700">
           <h1 class="title">How is your soul?</h1>
           <p class="subtitle">Capture your neural intent in 60 seconds.</p>
        </div>

        <!-- 🔘 GIANT RESONANCE BUTTON (Mobile/Outdoor Optimized) -->
        <div class="orb-hitbox" @click="handleOrbClick" :class="{ 'recording': isListening }">
          <div class="orb-scale-wrapper">
             <Orb :isListening="isListening" :isProcessing="isProcessing" />
          </div>
          
          <div v-if="isListening" class="recording-ui animate-in zoom-in duration-300">
              <div class="progress-ring">
                  <div class="time-readout">{{ sessionLimit - recordingTime }}s</div>
                  <div class="stop-label">TAP TO ANCHOR</div>
              </div>
          </div>
          
          <!-- Tactile Mic Hint -->
          <div v-if="!isListening" class="mic-hint">
              <Mic :size="24" class="fade-pulse" />
          </div>
        </div>

        <nav v-if="!isListening" class="bridge-nav fade-in duration-1000">
            <button @click="$emit('viewDiscovery')" class="bridge-link">
                <CircleDot :size="14" />
                <span>OKE Artifacts</span>
            </button>
            <button @click="$emit('viewMemos')" class="bridge-link">
                <Book :size="14" />
                <span>Second Brain</span>
            </button>
        </nav>
    </main>

    <footer v-if="!isListening" class="input-container animate-in slide-in-from-bottom duration-500">
        <div class="input-bar shadow-2xl">
                <input 
                v-model="textInputValue"
                @keydown.enter="handleTextSubmit"
                type="text" 
                placeholder="Synchronize manually..."
                />
                <button @click="handleTextSubmit" class="send-btn">
                <Play :size="16" fill="currentColor" class="translate-x-0.5" />
                </button>
        </div>
    </footer>

    <!-- Protective Processing Overlay -->
    <div v-if="isProcessing" class="processing-curtain">
        <div class="curtain-message">
            <div class="spinner-sacred"></div>
            <span>Synthesizing Soul Signal...</span>
        </div>
    </div>
  </div>
</template>

<style scoped>
.tive-root {
  width: 100%; height: 100vh;
  display: flex; flex-direction: column; align-items: center; justify-content: space-between;
  padding: 40px; background-color: #050202; color: #fff;
  font-family: 'Outfit', sans-serif; overflow: hidden; position: relative;
  transition: background-color 1.5s ease;
}
.light-mode { background-color: #fcfbf9; color: #1a1a1a; }

/* 🌊 Mimamori Aura Pulse */
.mimamori-aura {
    position: absolute; inset: 0;
    background: radial-gradient(circle at center, transparent 30%, rgba(255, 139, 139, 0.15) 100%);
    animation: aura-breathe 4s infinite ease-in-out;
    pointer-events: none; z-index: 5;
}
@keyframes aura-breathe { 0%, 100% { opacity: 0.3; scale: 1; } 50% { opacity: 0.8; scale: 1.1; } }

.is-recording { background-color: #0f0505; }

.tive-header { width: 100%; display: flex; justify-content: space-between; align-items: center; z-index: 50; }
.tive-branding { display: flex; align-items: center; gap: 12px; }
.tive-display { font-family: 'Cinzel', serif; font-weight: 700; letter-spacing: 2px; }

.nav-icons { display: flex; gap: 20px; align-items: center; }
.icon-btn { opacity: 0.4; transition: 0.3s; }
.icon-btn:hover { opacity: 1; }

.status-indicator {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
    padding: 8px 16px; border-radius: 20px; font-size: 10px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px; color: #FFD700;
}

.tive-main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; z-index: 10; transition: transform 0.5s ease; }
.hero-section { text-align: center; margin-bottom: 60px; }
.title { font-size: clamp(2.5rem, 8vw, 4.5rem); font-family: 'Cinzel', serif; margin-bottom: 20px; }
.subtitle { font-size: 1.1rem; opacity: 0.4; font-weight: 200; }

/* 🔘 GIANT INTERACTION HITBOX */
.orb-hitbox {
    position: relative; width: 400px; height: 400px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.orb-hitbox:hover { transform: scale(1.02); }
.orb-hitbox.recording { width: 100vw; height: 100vh; position: fixed; inset: 0; z-index: 100; background: rgba(0,0,0,0.4); }

.orb-scale-wrapper { transition: 1s cubic-bezier(0.4, 0, 0.2, 1); }
.recording .orb-scale-wrapper { transform: scale(1.3); }

.recording-ui { position: absolute; display: flex; flex-direction: column; align-items: center; pointer-events: none; }
.time-readout { font-size: 80px; font-family: 'Cinzel'; font-weight: 200; letter-spacing: -4px; color: #FF8B8B; }
.stop-label { font-size: 12px; font-weight: 900; letter-spacing: 4px; color: #FFD700; margin-top: -10px; }

.mic-hint { position: absolute; bottom: -60px; color: #fff; opacity: 0.2; }
.fade-pulse { animation: pulse-opacity 2s infinite ease-in-out; }
@keyframes pulse-opacity { 0%, 100% { opacity: 0.2; transform: translateY(0); } 50% { opacity: 0.6; transform: translateY(-5px); } }

.bridge-nav { margin-top: 80px; display: flex; gap: 40px; }
.bridge-link { display: flex; flex-direction: column; align-items: center; gap: 10px; opacity: 0.3; transition: 0.3s; }
.bridge-link span { font-size: 10px; font-weight: 700; letter-spacing: 2px; }
.bridge-link:hover { opacity: 1; color: #FFD700; }

.input-container { width: 100%; max-width: 440px; margin-bottom: 40px; }
.input-bar { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; display: flex; align-items: center; padding: 6px; backdrop-filter: blur(20px); }
.input-bar input { flex: 1; background: transparent; border: none; outline: none; padding: 12px 24px; color: inherit; font-size: 15px; }
.send-btn { width: 44px; height: 44px; background: #FF8B8B; color: #fff; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

/* Processing Curtain */
.processing-curtain { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 200; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px); }
.curtain-message { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.spinner-sacred { width: 40px; height: 40px; border: 2px solid rgba(255,215,0,0.1); border-top-color: #FFD700; border-radius: 50%; animation: spin 1s infinite linear; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-in { animation: fadeIn 1s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
