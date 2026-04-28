/**
 * Wrapper sobre la Web Speech API. Sin keys, sin coste — funciona en
 * Chrome, Edge, Safari modernos. Si el navegador no la soporta, las
 * funciones se vuelven no-op silenciosos.
 */

let currentUtterance = null;

export function isSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

function pickVoice(lang = 'es') {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.startsWith(lang) && v.default) ||
    voices.find((v) => v.lang.startsWith(lang)) ||
    voices[0]
  );
}

export function speak(text, { lang = 'es-ES', rate = 0.95, pitch = 1 } = {}) {
  if (!isSupported() || !text) return;
  stop();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = pitch;
  const voice = pickVoice(lang.split('-')[0]);
  if (voice) utter.voice = voice;
  currentUtterance = utter;
  window.speechSynthesis.speak(utter);
  return utter;
}

export function stop() {
  if (!isSupported()) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking() {
  return isSupported() && window.speechSynthesis.speaking;
}
