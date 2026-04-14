const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function transcribeSpeech({ transcriptHint = '' }) {
  if (!OPENAI_API_KEY) {
    return {
      transcript: transcriptHint || 'Mock transcript: candidate response captured in text mode.',
      provider: 'mock-whisper',
      confidence: 0.82,
    };
  }

  // Scaffold point:
  // Integrate multipart upload with OpenAI Whisper (audio file/blob) here.
  return {
    transcript: transcriptHint || 'Transcription placeholder (wire audio upload for production).',
    provider: 'openai-whisper',
    confidence: 0.9,
  };
}

async function synthesizeSpeech({ text }) {
  if (!OPENAI_API_KEY) {
    return {
      audioUrl: null,
      provider: 'mock-tts',
      note: 'No OPENAI_API_KEY configured. Returning text-only interviewer response.',
      text,
    };
  }

  // Scaffold point:
  // Call OpenAI TTS endpoint and persist output (S3/object storage), then return URL.
  return {
    audioUrl: null,
    provider: 'openai-tts',
    note: 'TTS scaffold enabled. Add persistent storage for generated audio.',
    text,
  };
}

module.exports = {
  transcribeSpeech,
  synthesizeSpeech,
};
