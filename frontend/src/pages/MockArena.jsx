import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiPlayCircle, FiCheckCircle, FiBarChart2, FiActivity, FiVideo, FiVolume2, FiMinimize2, FiDownload } from 'react-icons/fi';
import {
  createMockSession,
  getMockSessionById,
  getMockSessions,
  submitMockAnswer,
  completeMockSession,
} from '../services/mockArenaApi';

const ROLE_OPTIONS = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Data Analyst', 'Product Analyst'];
const INDUSTRY_OPTIONS = ['Software', 'FinTech', 'E-Commerce', 'Consulting', 'Telecom'];
const FILLER_WORDS = ['um', 'uh', 'like', 'actually', 'basically', 'you know'];
const SKIP_ANSWER_PATTERNS = [
  /\bsorry\b.*\b(do not know|don't know|no idea|not sure)\b/i,
  /\bi do not know\b/i,
  /\bi don't know\b/i,
  /\bskip (this )?question\b/i,
  /\bnext question\b/i,
  /\bpass\b/i,
];
const MEDIAPIPE_IMPORT_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MEDIAPIPE_WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm';
const MEDIAPIPE_MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

const cardStyle = (t) => ({
  background: t.card,
  border: `1px solid ${t.border}`,
  borderRadius: 14,
  padding: 16,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function countFillers(words) {
  if (!words.length) return 0;
  const fillers = words.filter((w) => FILLER_WORDS.includes(w.toLowerCase())).length;
  return fillers / words.length;
}

function isSkipToNextCommand(transcript = '') {
  return SKIP_ANSWER_PATTERNS.some((rx) => rx.test(transcript.trim()));
}

function getLandmarkCenter(landmarks) {
  if (!landmarks?.length) return { x: 0.5, y: 0.5 };
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < landmarks.length; i += 1) {
    sx += landmarks[i].x;
    sy += landmarks[i].y;
  }
  return { x: sx / landmarks.length, y: sy / landmarks.length };
}

const MockArena = ({ t, dark }) => {
  const [form, setForm] = useState({
    role: 'Software Engineer',
    industry: 'Software',
    company: '',
    experienceLevel: 'beginner',
    adaptivePressureMode: true,
    voiceEnabled: true,
    webcamEnabled: true,
    questionCount: 5,
  });

  const [sessions, setSessions] = useState([]);
  const [session, setSession] = useState(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [voiceMetrics] = useState({ tone: 60, pausesPerMinute: 4 });
  const [bodyLanguage, setBodyLanguage] = useState({ eyeContactPct: 70, postureScore: 75, expressionVariance: 55 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceInterviewRunning, setVoiceInterviewRunning] = useState(false);
  const [lastSpoken, setLastSpoken] = useState('');
  const [trackingBackend, setTrackingBackend] = useState('none');
  const [fullscreenFallback, setFullscreenFallback] = useState(false);

  const videoRef = useRef(null);
  const videoStageRef = useRef(null);
  const streamRef = useRef(null);
  const eyeLoopRef = useRef(null);
  const faceDetectorRef = useRef(null);
  const mediaPipeLandmarkerRef = useRef(null);
  const eyeStatsRef = useRef({ samples: 0, centered: 0, movementSum: 0, prevX: null, prevY: null });
  const recognitionRef = useRef(null);
  const abortVoiceInterviewRef = useRef(false);
  const voiceInterviewRunningRef = useRef(false);
  const lockedScrollYRef = useRef(0);

  const userId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.id || user._id || '';
    } catch {
      return '';
    }
  }, []);

  const selectedQuestion = useMemo(
    () => session?.questions?.find((q) => q.questionId === selectedQuestionId) || null,
    [session, selectedQuestionId]
  );

  const refreshSessions = async () => {
    if (!userId) return;
    try {
      const data = await getMockSessions(userId);
      setSessions(data.sessions || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const refreshCurrentSession = async (sessionId) => {
    const data = await getMockSessionById(sessionId);
    if (data?.session) {
      setSession(data.session);
      return data.session;
    }
    return null;
  };

  useEffect(() => { refreshSessions(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    voiceInterviewRunningRef.current = voiceInterviewRunning;
  }, [voiceInterviewRunning]);

  useEffect(() => {
    return () => {
      if (eyeLoopRef.current) clearInterval(eyeLoopRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((track) => track.stop());
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (fullscreenFallback) {
      lockedScrollYRef.current = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${lockedScrollYRef.current}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      return;
    }

    const y = lockedScrollYRef.current || 0;
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.overflow = '';
    if (y > 0) window.scrollTo({ top: y, behavior: 'auto' });
  }, [fullscreenFallback]);

  const ensureMediaPipeLandmarker = async () => {
    if (mediaPipeLandmarkerRef.current) return true;
    try {
      const vision = await import(/* @vite-ignore */ MEDIAPIPE_IMPORT_URL);
      const resolver = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      mediaPipeLandmarkerRef.current = await vision.FaceLandmarker.createFromOptions(resolver, {
        baseOptions: {
          modelAssetPath: MEDIAPIPE_MODEL_URL,
        },
        runningMode: 'VIDEO',
        numFaces: 1,
      });
      setTrackingBackend('mediapipe');
      return true;
    } catch (_) {
      return false;
    }
  };

  const detectFaceData = async () => {
    if (!videoRef.current || videoRef.current.readyState < 2) return null;

    if (mediaPipeLandmarkerRef.current) {
      const ts = performance.now();
      const result = mediaPipeLandmarkerRef.current.detectForVideo(videoRef.current, ts);
      const landmarks = result?.faceLandmarks?.[0];
      if (!landmarks?.length) return null;

      const center = getLandmarkCenter(landmarks);
      const leftOuter = landmarks[33];
      const leftInner = landmarks[133];
      const rightInner = landmarks[362];
      const rightOuter = landmarks[263];
      const leftIris = landmarks[468];
      const rightIris = landmarks[473];

      let gazeCentered = false;
      if (leftOuter && leftInner && rightInner && rightOuter && leftIris && rightIris) {
        const leftRatio = (leftIris.x - leftOuter.x) / Math.max(0.0001, (leftInner.x - leftOuter.x));
        const rightRatio = (rightIris.x - rightInner.x) / Math.max(0.0001, (rightOuter.x - rightInner.x));
        gazeCentered = leftRatio >= 0.25 && leftRatio <= 0.75 && rightRatio >= 0.25 && rightRatio <= 0.75;
      } else {
        gazeCentered = center.x >= 0.36 && center.x <= 0.64;
      }

      return { x: center.x, y: center.y, centered: gazeCentered };
    }

    if (faceDetectorRef.current) {
      const faces = await faceDetectorRef.current.detect(videoRef.current);
      if (!faces.length) return null;
      const box = faces[0].boundingBox;
      const vw = videoRef.current.videoWidth || 1;
      const vh = videoRef.current.videoHeight || 1;
      const x = (box.x + box.width / 2) / vw;
      const y = (box.y + box.height / 2) / vh;
      const centered = x >= 0.35 && x <= 0.65 && y >= 0.2 && y <= 0.8;
      return { x, y, centered };
    }

    return null;
  };

  const startEyeTrackingLoop = () => {
    if (eyeLoopRef.current) clearInterval(eyeLoopRef.current);
    eyeLoopRef.current = setInterval(async () => {
      if (!form.webcamEnabled) return;
      const stats = eyeStatsRef.current;
      stats.samples += 1;
      try {
        const face = await detectFaceData();
        if (!face) return;
        if (face.centered) stats.centered += 1;
        if (stats.prevX != null && stats.prevY != null) {
          stats.movementSum += Math.abs(face.x - stats.prevX) + Math.abs(face.y - stats.prevY);
        }
        stats.prevX = face.x;
        stats.prevY = face.y;
        const eyeContactPct = stats.samples ? Math.round((stats.centered / stats.samples) * 100) : 0;
        const movementAvg = stats.samples > 1 ? (stats.movementSum / (stats.samples - 1)) : 0;
        const postureScore = Math.max(45, Math.min(100, Math.round(95 - movementAvg * 220)));
        const expressionVariance = Math.max(30, Math.min(100, Math.round(movementAvg * 700)));
        setBodyLanguage({ eyeContactPct, postureScore, expressionVariance });
      } catch (_) {}
    }, 1000);
  };

  const enterFullscreenStage = async () => {
    setFullscreenFallback(true);
  };

  const exitFullscreenStage = async () => {
    setFullscreenFallback(false);
  };

  const startCamera = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setError('Camera API not supported in this browser.');
      return;
    }
    try {
      // Request video only — audio is handled by the Web Speech API (SpeechRecognition).
      // Requesting audio:true here would lock the microphone and block speech recognition
      // on most browsers, causing silent failures or 'audio-capture' errors.
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const mpReady = await ensureMediaPipeLandmarker();
      if (!mpReady && 'FaceDetector' in window) {
        faceDetectorRef.current = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 1 });
        setTrackingBackend('face-detector');
      } else if (!mpReady) {
        setTrackingBackend('head-motion-fallback');
      }

      setCameraReady(true);
      setError('');
      startEyeTrackingLoop();
    } catch (err) {
      setError(`Unable to access camera/mic: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (eyeLoopRef.current) clearInterval(eyeLoopRef.current);
    eyeLoopRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraReady(false);
  };

  const speakText = async (text) => {
    if (!form.voiceEnabled || !window.speechSynthesis) return;
    setLastSpoken(text);
    await new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    });
  };

  const listenOnce = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) throw new Error('Speech recognition is not supported in this browser.');
    return new Promise((resolve, reject) => {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-IN';
      recognition.interimResults = true;
      // Use continuous mode so the browser doesn't cut off after the first pause.
      // We manually stop after 2.5s of silence post-speech.
      recognition.continuous = true;

      let finalCaptured = '';
      let latestInterim = '';
      let silenceTimer = null;
      let hasSpeech = false;
      let settled = false;
      setListening(true);

      const SILENCE_MS = 2500; // stop 2.5s after speaker goes quiet

      const finish = () => {
        if (settled) return;
        settled = true;
        if (silenceTimer) clearTimeout(silenceTimer);
        setListening(false);
        try { recognition.stop(); } catch (_) {}
        resolve((finalCaptured || latestInterim).trim());
      };

      const resetSilenceTimer = () => {
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(finish, SILENCE_MS);
      };

      recognition.onresult = (event) => {
        // Rebuild full running transcript from all results
        let running = '';
        for (let i = 0; i < event.results.length; i += 1) {
          running += `${event.results[i][0]?.transcript || ''} `;
        }
        // Accumulate final segments
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const part = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) finalCaptured += `${part} `;
        }
        latestInterim = running;
        if (running.trim()) {
          setAnswerText(running.trim());
          hasSpeech = true;
          // Reset the silence timer every time new speech arrives
          resetSilenceTimer();
        }
      };

      recognition.onerror = (event) => {
        const nonFatalErrors = ['no-speech', 'audio-capture'];
        if (nonFatalErrors.includes(event.error)) {
          // If we already heard something, treat a no-speech error as end-of-answer
          if (hasSpeech) finish();
          return;
        }
        if (settled) return;
        settled = true;
        if (silenceTimer) clearTimeout(silenceTimer);
        setListening(false);
        reject(new Error(event.error || 'speech recognition failed'));
      };

      recognition.onend = () => {
        // onend fires when recognition stops (either by us calling stop() or browser timeout)
        // Only resolve here if we haven't settled already
        if (!settled) finish();
      };

      try {
        recognition.start();
        // Safety max: auto-finish after 90s in case of dead mic
        setTimeout(finish, 90000);
      } catch (err) {
        setListening(false);
        reject(err);
      }
    });
  };

  const startSession = async () => {
    if (!userId) {
      setError('Please login again. User id not found.');
      return;
    }
    if (form.webcamEnabled && !cameraReady) {
      await startCamera();
    }
    setLoading(true);
    setError('');
    try {
      const res = await createMockSession({
        userId,
        role: form.role,
        industry: form.industry,
        company: form.company.trim(),
        experienceLevel: form.experienceLevel,
        adaptivePressureMode: form.adaptivePressureMode,
        voiceEnabled: form.voiceEnabled,
        webcamEnabled: form.webcamEnabled,
        questionCount: form.questionCount,
        questionMix: { technical: 50, systemDesign: 25, behavioral: 25 },
      });
      setSession(res.session);
      setSelectedQuestionId(res.session?.questions?.[0]?.questionId || null);
      setAnswerText('');
      await refreshSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswerPayload = async ({ questionId, transcript, explicitVoiceMetrics }) => {
    if (!session || !questionId || !transcript.trim()) return;
    const words = transcript.trim().split(/\s+/).filter(Boolean);
    const paceWpm = explicitVoiceMetrics?.paceWpm || Math.max(80, Math.min(190, Math.round(words.length / 0.75)));
    const fillerWordRate = explicitVoiceMetrics?.fillerWordRate ?? countFillers(words);
    const computedVoiceMetrics = explicitVoiceMetrics || {
      paceWpm,
      tone: voiceMetrics.tone,
      fillerWordRate,
      pausesPerMinute: voiceMetrics.pausesPerMinute,
    };

    await submitMockAnswer(session._id, {
      questionId,
      transcript: transcript.trim(),
      voiceMetrics: computedVoiceMetrics,
      bodyLanguage: form.webcamEnabled ? bodyLanguage : {},
    });

    const updatedSession = await refreshCurrentSession(session._id);
    await refreshSessions();
    return updatedSession;
  };

  const finishSession = async () => {
    if (!session) return;
    setLoading(true);
    setError('');
    try {
      const res = await completeMockSession(session._id);
      setSession(res.session);
      await refreshSessions();
      await speakText(`Session complete. Your overall grade is ${res.session?.scores?.overallGrade || 0}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!session?.scores?.overallGrade) return;
    const s = session;
    const r = s.report || {};
    const meta = r.sessionMeta || {};
    const sc = s.scores || {};
    const perQ = r.perQuestion || [];

    const scoreColor = (v) => v >= 75 ? '#10b981' : v >= 55 ? '#f59e0b' : '#e53e3e';
    const bar = (v) => `<div style="height:8px;border-radius:4px;background:#e2e8f0;margin-top:4px"><div style="height:100%;width:${v || 0}%;background:${scoreColor(v || 0)};border-radius:4px"></div></div>`;
    const badge = (label, color) => `<span style="background:${color}22;color:${color};border:1px solid ${color}44;border-radius:10px;padding:2px 8px;font-size:11px;font-weight:700">${label}</span>`;

    const perQHtml = perQ.map((q) => `
      <div style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:14px;overflow:hidden;page-break-inside:avoid">
        <div style="background:#f8fafc;padding:10px 14px;border-bottom:1px solid #e2e8f0">
          <div style="display:flex;justify-content:space-between;margin-bottom:4px">
            <span style="font-size:12px;font-weight:700;color:#0891b2">Q${q.index} &middot; ${q.type}</span>
            ${badge(q.answerValidity, q.answerValidity === 'valid' ? '#10b981' : q.answerValidity === 'partial' ? '#f97316' : '#e53e3e')}
          </div>
          <div style="font-size:13px;color:#1e293b;line-height:1.5">${q.prompt}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:#e2e8f0">
          ${[['Technical', q.technicalAccuracy, q.technicalLabel], ['Confidence', q.confidenceScore, q.confidenceLabel], ['Communication', q.communicationScore, q.communicationLabel]].map(([l, v, lb]) => `<div style="background:#fff;padding:8px;text-align:center"><div style="font-size:10px;color:#64748b">${l}</div><div style="font-size:18px;font-weight:800;color:${scoreColor(v)}">${v}</div><div style="font-size:10px;color:#94a3b8">${lb || ''}</div></div>`).join('')}
        </div>
        <div style="padding:10px 14px;background:#fff;font-size:12px;color:#475569;line-height:1.8">
          <div>&#128065; Eye Contact: <strong style="color:${scoreColor(q.eyeContactPct)}">${q.eyeContactPct}% [${q.eyeContactGrade}]</strong> &mdash; ${q.eyeContactNote}</div>
          <div>&#127932; Pace: ${q.paceLabel} ${!q.paceOk ? '&#9888;' : ''}</div>
          <div>&#128172; Filler words: ~${q.fillerRate}% &mdash; ${q.fillerNote}</div>
        </div>
        ${q.feedback ? `<div style="padding:8px 14px;border-top:1px solid #e2e8f0;background:#fff;font-size:12px;color:#475569"><strong style="color:#0891b2">Feedback:</strong> ${q.feedback}</div>` : ''}
        ${q.transcript ? `<div style="padding:8px 14px;border-top:1px solid #e2e8f0;background:#f8fafc;font-size:11px;color:#64748b;font-style:italic"><strong style="font-style:normal;color:#334155">Your answer:</strong> ${q.transcript}</div>` : ''}
      </div>
    `).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Placera Interview Report</title>
    <style>body{font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:24px;color:#1e293b;font-size:13px}h1{font-size:22px;font-weight:800;color:#0f172a;margin:0 0 4px}h2{font-size:15px;font-weight:700;color:#0f172a;margin:20px 0 10px;padding-bottom:4px;border-bottom:2px solid #e2e8f0}h3{font-size:13px;font-weight:700;margin:12px 0 6px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:18px;background:#f8fafc;padding:12px;border-radius:8px;border:1px solid #e2e8f0}.meta-item{font-size:12px;color:#475569}.meta-item strong{color:#0f172a}.score-card{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}.sc{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px}.sc-label{font-size:10px;color:#94a3b8;text-transform:uppercase}.sc-val{font-size:22px;font-weight:800}.list{list-style:none;padding:0;margin:0 0 16px}.list li{padding:5px 0 5px 12px;border-left:3px solid #cbd5e1;margin-bottom:5px;font-size:12px;color:#475569}.list li.green{border-color:#10b981}.list li.red{border-color:#e53e3e}.list li.amber{border-color:#f97316}.list li.cyan{border-color:#0891b2}.footer{text-align:center;margin-top:24px;font-size:11px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px}@media print{body{padding:16px}.page-break{page-break-before:always}}</style>
    </head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px">
      <div><h1>&#127942; Placera Mock Interview Report</h1><div style="font-size:12px;color:#64748b">${s.role} &middot; ${s.industry} &middot; ${s.company || 'General'} &middot; ${s.experienceLevel}</div><div style="font-size:11px;color:#94a3b8;margin-top:2px">${new Date(s.createdAt).toLocaleString()}</div></div>
      <div style="text-align:right;background:${scoreColor(sc.overallGrade)};color:#fff;padding:12px 18px;border-radius:12px"><div style="font-size:32px;font-weight:900;line-height:1">${sc.overallGrade}</div><div style="font-size:11px">/100 Overall</div></div>
    </div>
    <h2>Overall Scores</h2>
    <div class="score-card">
      ${[['Confidence', sc.confidence], ['Communication', sc.communication], ['Technical Accuracy', sc.technicalAccuracy], ['Composure', sc.composure]].map(([l, v]) => `<div class="sc"><div class="sc-label">${l}</div><div class="sc-val" style="color:${scoreColor(v)}">${v}<span style="font-size:13px;color:#94a3b8">/100</span></div>${bar(v)}</div>`).join('')}
    </div>
    <h2>Session Metrics</h2>
    <div class="meta">
      <div class="meta-item">Questions Answered: <strong>${meta.answeredCount || 0} / ${meta.totalQuestions || 0}</strong></div>
      <div class="meta-item">Skipped: <strong style="color:${(meta.unknownCount || 0) > 0 ? '#e53e3e' : '#10b981'}">${meta.unknownCount || 0}</strong></div>
      <div class="meta-item">Avg Eye Contact: <strong>${meta.avgEyeContact || 0}% [${meta.eyeContactGrade || '-'}]</strong></div>
      <div class="meta-item">Avg Posture: <strong>${meta.avgPosture || 0}/100</strong></div>
      <div class="meta-item">Speaking Pace: <strong>${meta.avgPaceWpm || 0} wpm</strong></div>
      <div class="meta-item">Filler Words: <strong>${meta.avgFillerRate || 0}%</strong></div>
      <div class="meta-item" style="grid-column:span 2">${meta.eyeContactNote || ''} ${meta.postureNote || ''}</div>
    </div>
    ${(r.typeAverages || []).length > 0 ? `<h2>By Question Type</h2>${(r.typeAverages || []).map((ta) => `<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:12px;color:#64748b"><span style="text-transform:capitalize">${ta.type}</span><strong style="color:${scoreColor(ta.avg)}">${ta.avg}/100</strong></div>${bar(ta.avg)}</div>`).join('')}<div style="font-size:11px;margin-top:8px"><span style="color:#10b981">&#10003; Strongest: ${r.strongestType || '-'}</span> &nbsp; <span style="color:#e53e3e">&#10007; Weakest: ${r.weakestType || '-'}</span></div>` : ''}
    <h2>Strengths</h2><ul class="list">${(r.strengths || []).map((s) => `<li class="green">${s}</li>`).join('')}</ul>
    <h2>Weaknesses</h2><ul class="list">${(r.weaknesses || []).map((w) => `<li class="red">${w}</li>`).join('')}</ul>
    <h2>Suggested Improvements</h2><ul class="list">${(r.suggestedImprovements || []).map((i) => `<li class="amber">${i}</li>`).join('')}</ul>
    <h2>Recommendations</h2><ul class="list">${(r.recommendations || []).map((rec) => `<li class="cyan">${rec}</li>`).join('')}</ul>
    <h2 class="page-break">Per-Question Breakdown</h2>
    ${perQHtml}
    <div class="footer">Generated by Placera Mock Arena &middot; ${new Date().toLocaleString()}</div>
    </body></html>`;

    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 600);
  };

  const startVoiceInterview = async () => {
    if (!session?.questions?.length) return;
    if (!form.voiceEnabled) {
      setError('Enable Voice mode for AI voice interaction.');
      return;
    }
    if (!cameraReady) await startCamera();
    voiceInterviewRunningRef.current = true;
    await enterFullscreenStage();
    abortVoiceInterviewRef.current = false;
    setVoiceInterviewRunning(true);
    setError('');

    try {
      for (let i = 0; i < session.questions.length; i += 1) {
        if (abortVoiceInterviewRef.current) break;
        const q = session.questions[i];
        setSelectedQuestionId(q.questionId);
        await speakText(`Question ${i + 1}. ${q.prompt}. Please answer now.`);
        const startedAt = Date.now();
        const transcript = await listenOnce();
        if (!transcript) {
          await speakText('I could not hear your response clearly. Moving to the next question.');
          continue;
        }
        const minutes = Math.max(0.25, (Date.now() - startedAt) / 60000);
        const words = transcript.split(/\s+/).filter(Boolean);
        const computedVoice = {
          paceWpm: Math.max(80, Math.min(200, Math.round(words.length / minutes))),
          tone: voiceMetrics.tone,
          fillerWordRate: countFillers(words),
          pausesPerMinute: voiceMetrics.pausesPerMinute,
        };

        if (isSkipToNextCommand(transcript)) {
          setAnswerText(transcript);
          await submitAnswerPayload({
            questionId: q.questionId,
            transcript: 'Sorry, I do not know the answer.',
            explicitVoiceMetrics: computedVoice,
          });
          await speakText('Noted. Moving to the next question.');
          continue;
        }

        setAnswerText(transcript);
        await submitAnswerPayload({ questionId: q.questionId, transcript, explicitVoiceMetrics: computedVoice });
        await sleep(300);
      }

      if (!abortVoiceInterviewRef.current) {
        await speakText('Great work. I am generating your final interview report.');
        await finishSession();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      voiceInterviewRunningRef.current = false;
      setVoiceInterviewRunning(false);
      setListening(false);
      await exitFullscreenStage();
    }
  };

  const stopVoiceInterview = async () => {
    abortVoiceInterviewRef.current = true;
    voiceInterviewRunningRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setVoiceInterviewRunning(false);
    await exitFullscreenStage();
  };

  return (
    <div style={{ display: 'grid', gap: 16, animation: 'fadeUp 0.2s ease both' }}>
      <div style={{ ...cardStyle(t), display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: t.textPrimary }}>Mock Arena</div>
          <div style={{ fontSize: 12.5, color: t.textMuted, marginTop: 4 }}>
            Full voice AI interview with live camera eye-tracking and confidence scoring.
          </div>
        </div>
        <span style={{ fontSize: 11, borderRadius: 20, padding: '4px 10px', color: '#10b981', border: '1px solid rgba(16,185,129,0.35)', background: 'rgba(16,185,129,0.12)', fontWeight: 700 }}>
          Adaptive Pressure Mode
        </span>
      </div>

      {error && (
        <div style={{ ...cardStyle(t), border: '1px solid rgba(244,63,94,0.35)', color: '#f43f5e', fontSize: 13 }}>{error}</div>
      )}

      <div style={{ ...cardStyle(t) }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 10 }}>
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} style={{ padding: 10, borderRadius: 8, background: t.elevated, color: t.textPrimary, border: `1px solid ${t.border}` }}>
            {ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={form.industry} onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))} style={{ padding: 10, borderRadius: 8, background: t.elevated, color: t.textPrimary, border: `1px solid ${t.border}` }}>
            {INDUSTRY_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={form.experienceLevel} onChange={(e) => setForm((f) => ({ ...f, experienceLevel: e.target.value }))} style={{ padding: 10, borderRadius: 8, background: t.elevated, color: t.textPrimary, border: `1px solid ${t.border}` }}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <input
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            placeholder="Target company (optional)"
            style={{ padding: 10, borderRadius: 8, background: t.elevated, color: t.textPrimary, border: `1px solid ${t.border}` }}
          />
          <select
            value={form.questionCount}
            onChange={(e) => setForm((f) => ({ ...f, questionCount: Number(e.target.value) }))}
            style={{ padding: 10, borderRadius: 8, background: t.elevated, color: t.textPrimary, border: `1px solid ${t.border}` }}
            title="Number of questions in the session"
          >
            {[3, 4, 5, 6, 7, 8, 10, 12, 15].map((n) => (
              <option key={n} value={n}>{n} Questions{n <= 5 ? ' (Demo)' : ''}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {[
            ['adaptivePressureMode', 'Adaptive Pressure'],
            ['voiceEnabled', 'Voice'],
            ['webcamEnabled', 'Webcam Eye Tracking'],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
              style={{
                padding: '6px 12px',
                borderRadius: 20,
                border: `1px solid ${form[key] ? '#06b6d4' : t.border}`,
                background: form[key] ? 'rgba(6,182,212,0.13)' : t.elevated,
                color: form[key] ? '#06b6d4' : t.textSecondary,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {form[key] ? '✓ ' : ''}{label}
            </button>
          ))}
          <button
            onClick={startSession}
            disabled={loading}
            style={{ marginLeft: 'auto', border: 'none', borderRadius: 10, padding: '9px 14px', fontWeight: 700, background: '#06b6d4', color: '#001018', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <FiPlayCircle size={14} /> Start Mock Session
          </button>
        </div>
      </div>

      <div
        ref={videoStageRef}
        style={{
          ...cardStyle(t),
          position: fullscreenFallback ? 'fixed' : 'relative',
          inset: fullscreenFallback ? 0 : undefined,
          zIndex: fullscreenFallback ? 1000 : 'auto',
          borderRadius: fullscreenFallback ? 0 : 14,
          padding: fullscreenFallback ? 12 : 16,
          display: 'grid',
          gridTemplateColumns: '1fr',
          minHeight: fullscreenFallback ? '100vh' : 'calc(100vh - 190px)',
          background: '#000',
        }}
      >
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12 }} />
        <div style={{ position: 'absolute', top: 22, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={startCamera} style={{ border: 'none', borderRadius: 10, padding: '8px 12px', background: '#0ea5e9', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <FiVideo size={13} /> {cameraReady ? 'Restart Camera' : 'Enable Camera + Mic'}
            </button>
            <button onClick={startVoiceInterview} disabled={!session || voiceInterviewRunning || loading} style={{ border: 'none', borderRadius: 10, padding: '8px 12px', background: '#22c55e', color: '#05210f', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7, fontWeight: 700 }}>
              <FiVolume2 size={13} /> Start Voice Interview
            </button>
            <button onClick={stopVoiceInterview} disabled={!voiceInterviewRunning && !listening} style={{ border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 7 }}>
              <FiMinimize2 size={13} /> Stop Voice Flow
            </button>
          </div>
          <button onClick={exitFullscreenStage} style={{ pointerEvents: 'auto', border: '1px solid rgba(255,255,255,0.35)', borderRadius: 10, padding: '8px 12px', background: 'rgba(0,0,0,0.45)', color: '#fff', cursor: 'pointer' }}>
            Exit Fullscreen
          </button>
        </div>
        <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, borderRadius: 12, padding: 12, background: 'rgba(0,0,0,0.5)', color: '#ecfeff', fontSize: 12, lineHeight: 1.7 }}>
          <strong>Status:</strong> {cameraReady ? 'Camera active' : 'Camera inactive'} · {listening ? 'Listening...' : voiceInterviewRunning ? 'AI interviewing...' : 'Idle'} · <strong>Tracker:</strong> {trackingBackend}
          <br />
          <strong>Eye Contact:</strong> {bodyLanguage.eyeContactPct}% · <strong>Posture:</strong> {bodyLanguage.postureScore} · <strong>Expression:</strong> {bodyLanguage.expressionVariance}
          <br />
          <strong>AI Last Prompt:</strong> {lastSpoken || 'No voice prompt yet'}
          <br />
          <strong>Voice command:</strong> say <em>"sorry, I do not know the answer"</em> (or <em>"skip question"</em>) to move ahead.
          <br />
          <strong>Transcript (voice captured):</strong> {answerText || 'Waiting for candidate response...'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={cardStyle(t)}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Current Voice Interview</div>
          {!session && <div style={{ color: t.textMuted, fontSize: 12.5 }}>Start a session to generate AI-tailored questions.</div>}
          {session && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {(session.questions || []).map((q, idx) => (
                  <button
                    key={q.questionId}
                    onClick={() => setSelectedQuestionId(q.questionId)}
                    style={{
                      borderRadius: 20,
                      border: `1px solid ${selectedQuestionId === q.questionId ? '#06b6d4' : t.border}`,
                      background: selectedQuestionId === q.questionId ? 'rgba(6,182,212,0.15)' : t.elevated,
                      color: selectedQuestionId === q.questionId ? '#06b6d4' : t.textSecondary,
                      padding: '5px 10px',
                      fontSize: 11.5,
                      cursor: 'pointer',
                    }}
                  >
                    Q{idx + 1} · {q.type}
                  </button>
                ))}
              </div>
              {selectedQuestion && (
                <div style={{ border: `1px solid ${t.border}`, background: t.elevated, borderRadius: 10, padding: 12 }}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
                    Difficulty: <strong style={{ color: t.textPrimary }}>{selectedQuestion.difficulty}</strong>
                  </div>
                  <div style={{ fontSize: 13.5, color: t.textPrimary, lineHeight: 1.6 }}>{selectedQuestion.prompt}</div>
                  {!!selectedQuestion.followUps?.length && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#f97316' }}>
                      Pressure follow-up: {selectedQuestion.followUps[selectedQuestion.followUps.length - 1]}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button onClick={finishSession} disabled={loading || !session?.answers?.length || session?.status === 'completed'} style={{ border: 'none', borderRadius: 10, padding: '8px 14px', background: '#22c55e', color: '#05210f', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
                  <FiCheckCircle size={13} /> Finish & Generate Report
                </button>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ ...cardStyle(t), gridColumn: 'span 1' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><FiBarChart2 size={14} /> Session Report</span>
              {session?.scores?.overallGrade > 0 && (
                <button
                  onClick={downloadReport}
                  style={{ border: '1px solid #06b6d4', borderRadius: 8, padding: '5px 11px', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <FiDownload size={12} /> Download PDF
                </button>
              )}
            </div>
            {!session?.scores?.overallGrade ? (
              <div style={{ color: t.textMuted, fontSize: 12.5 }}>Complete voice interview to get your full detailed report.</div>
            ) : (() => {
              const sc = session.scores;
              const rpt = session.report || {};
              const meta = rpt.sessionMeta || {};
              const perQ = rpt.perQuestion || [];
              const scoreColor = (v) => v >= 75 ? '#10b981' : v >= 55 ? '#f59e0b' : '#f43f5e';
              const ScoreBar = ({ val }) => (
                <div style={{ height: 6, borderRadius: 4, background: t.border, marginTop: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${val}%`, background: scoreColor(val), borderRadius: 4, transition: 'width 0.6s ease' }} />
                </div>
              );
              return (
                <>
                  {/* Overall Grade */}
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1, color: scoreColor(sc.overallGrade) }}>{sc.overallGrade}</div>
                    <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 4 }}>/100 Overall Grade</div>
                  </div>

                  {/* Score Bars */}
                  <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
                    {[
                      ['Confidence', sc.confidence],
                      ['Communication', sc.communication],
                      ['Technical Accuracy', sc.technicalAccuracy],
                      ['Composure', sc.composure],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: t.textSecondary, marginBottom: 2 }}>
                          <span>{label}</span>
                          <span style={{ fontWeight: 700, color: scoreColor(val) }}>{val}/100</span>
                        </div>
                        <ScoreBar val={val} />
                      </div>
                    ))}
                  </div>

                  {/* Session Meta */}
                  <div style={{ background: t.elevated, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 11.5 }}>
                    <div style={{ fontWeight: 700, color: t.textPrimary, marginBottom: 7, fontSize: 12 }}>📊 Session Metrics</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px', color: t.textSecondary, lineHeight: 1.8 }}>
                      <span>Questions Answered</span><span style={{ color: t.textPrimary, fontWeight: 600 }}>{meta.answeredCount}/{meta.totalQuestions}</span>
                      <span>Skipped</span><span style={{ color: meta.unknownCount > 0 ? '#f43f5e' : '#10b981', fontWeight: 600 }}>{meta.unknownCount || 0}</span>
                      <span>Avg Eye Contact</span><span style={{ color: t.textPrimary, fontWeight: 600 }}>{meta.avgEyeContact}% <span style={{ color: scoreColor(meta.avgEyeContact) }}>[{meta.eyeContactGrade}]</span></span>
                      <span>Avg Posture</span><span style={{ color: t.textPrimary, fontWeight: 600 }}>{meta.avgPosture}/100</span>
                      <span>Speaking Pace</span><span style={{ color: t.textPrimary, fontWeight: 600 }}>{meta.avgPaceWpm || 0} wpm</span>
                      <span>Filler Words</span><span style={{ color: (meta.avgFillerRate || 0) > 10 ? '#f97316' : '#10b981', fontWeight: 600 }}>~{meta.avgFillerRate || 0}%</span>
                    </div>
                    <div style={{ marginTop: 7, fontSize: 11, color: t.textMuted }}>{meta.eyeContactNote}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{meta.postureNote}</div>
                    <div style={{ fontSize: 11, color: t.textMuted }}>{meta.paceLabel}</div>
                  </div>

                  {/* Performance by Type */}
                  {(rpt.typeAverages || []).length > 0 && (
                    <div style={{ background: t.elevated, borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 11.5 }}>
                      <div style={{ fontWeight: 700, color: t.textPrimary, marginBottom: 7, fontSize: 12 }}>📂 By Question Type</div>
                      {rpt.typeAverages.map((ta) => (
                        <div key={ta.type} style={{ marginBottom: 6 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: t.textSecondary, marginBottom: 2 }}>
                            <span style={{ textTransform: 'capitalize' }}>{ta.type}</span>
                            <span style={{ fontWeight: 700, color: scoreColor(ta.avg) }}>{ta.avg}/100</span>
                          </div>
                          <ScoreBar val={ta.avg} />
                        </div>
                      ))}
                      <div style={{ marginTop: 8, fontSize: 11, display: 'flex', gap: 12 }}>
                        <span style={{ color: '#10b981' }}>✓ Strongest: <strong>{rpt.strongestType}</strong></span>
                        <span style={{ color: '#f43f5e' }}>✗ Weakest: <strong>{rpt.weakestType}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* Strengths */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#10b981', marginBottom: 5 }}>✅ Strengths</div>
                    {(rpt.strengths || []).map((s, i) => (
                      <div key={i} style={{ fontSize: 11.5, color: t.textSecondary, marginBottom: 3, paddingLeft: 8, borderLeft: '2px solid #10b981' }}>{s}</div>
                    ))}
                  </div>

                  {/* Weaknesses */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f43f5e', marginBottom: 5 }}>⚠ Weaknesses</div>
                    {(rpt.weaknesses || []).map((w, i) => (
                      <div key={i} style={{ fontSize: 11.5, color: t.textSecondary, marginBottom: 3, paddingLeft: 8, borderLeft: '2px solid #f43f5e' }}>{w}</div>
                    ))}
                  </div>

                  {/* Improvements */}
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#f97316', marginBottom: 5 }}>🚀 Improvements</div>
                    {(rpt.suggestedImprovements || []).map((imp, i) => (
                      <div key={i} style={{ fontSize: 11.5, color: t.textSecondary, marginBottom: 3, paddingLeft: 8, borderLeft: '2px solid #f97316' }}>{imp}</div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div style={{ background: 'rgba(6,182,212,0.07)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: 10, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#06b6d4', marginBottom: 6 }}>💡 Recommendations</div>
                    {(rpt.recommendations || []).map((rec, i) => (
                      <div key={i} style={{ fontSize: 11.5, color: t.textSecondary, marginBottom: 4, display: 'flex', gap: 6 }}>
                        <span style={{ color: '#06b6d4', fontWeight: 700 }}>{i + 1}.</span> {rec}
                      </div>
                    ))}
                  </div>

                  {/* Per-Question Breakdown */}
                  {perQ.length > 0 && (
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: t.textPrimary, marginBottom: 8 }}>📋 Per-Question Breakdown</div>
                      {perQ.map((q) => (
                        <div key={q.questionId} style={{ border: `1px solid ${t.border}`, borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
                          {/* Question header */}
                          <div style={{ background: t.elevated, padding: '8px 12px', borderBottom: `1px solid ${t.border}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: '#06b6d4' }}>Q{q.index} · {q.type}</span>
                              <span style={{ fontSize: 10.5, padding: '2px 7px', borderRadius: 10, background: q.answerValidity === 'valid' ? 'rgba(16,185,129,0.15)' : q.answerValidity === 'partial' ? 'rgba(249,115,22,0.15)' : 'rgba(244,63,94,0.15)', color: q.answerValidity === 'valid' ? '#10b981' : q.answerValidity === 'partial' ? '#f97316' : '#f43f5e', fontWeight: 600 }}>{q.answerValidity}</span>
                            </div>
                            <div style={{ fontSize: 12, color: t.textPrimary, lineHeight: 1.5 }}>{q.prompt}</div>
                          </div>
                          {/* Scores row */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: t.border }}>
                            {[['Technical', q.technicalAccuracy, q.technicalLabel], ['Confidence', q.confidenceScore, q.confidenceLabel], ['Communication', q.communicationScore, q.communicationLabel]].map(([lbl, val, lab]) => (
                              <div key={lbl} style={{ background: t.card, padding: '6px 10px', textAlign: 'center' }}>
                                <div style={{ fontSize: 10, color: t.textMuted }}>{lbl}</div>
                                <div style={{ fontSize: 15, fontWeight: 800, color: scoreColor(val) }}>{val}</div>
                                <div style={{ fontSize: 9.5, color: t.textMuted }}>{lab}</div>
                              </div>
                            ))}
                          </div>
                          {/* Body language + voice */}
                          <div style={{ padding: '8px 12px', fontSize: 11, color: t.textSecondary, lineHeight: 1.8, background: t.card }}>
                            <div>👁‍🗨 Eye Contact: <strong style={{ color: scoreColor(q.eyeContactPct) }}>{q.eyeContactPct}% [{q.eyeContactGrade}]</strong> — {q.eyeContactNote}</div>
                            <div>🧍 Posture: {q.postureNote}</div>
                            <div>🎙 Pace: {q.paceLabel} {!q.paceOk && <span style={{ color: '#f97316' }}> ⚠</span>}</div>
                            <div>💬 Filler words: ~{q.fillerRate}% — {q.fillerNote}</div>
                          </div>
                          {/* Feedback */}
                          {q.feedback && (
                            <div style={{ padding: '8px 12px', borderTop: `1px solid ${t.border}`, background: t.card, fontSize: 11.5, color: t.textSecondary, lineHeight: 1.6 }}>
                              <span style={{ color: '#06b6d4', fontWeight: 700 }}>Feedback: </span>{q.feedback}
                            </div>
                          )}
                          {/* Transcript */}
                          {q.transcript && (
                            <div style={{ padding: '8px 12px', borderTop: `1px solid ${t.border}`, background: 'rgba(0,0,0,0.2)', fontSize: 11, color: t.textMuted, lineHeight: 1.6, fontStyle: 'italic' }}>
                              <span style={{ color: t.textSecondary, fontStyle: 'normal', fontWeight: 700 }}>Your answer: </span>{q.transcript}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div style={cardStyle(t)}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 7 }}>
              <FiActivity size={14} /> Past Sessions
            </div>
            {!sessions.length && <div style={{ color: t.textMuted, fontSize: 12.5 }}>No past sessions yet.</div>}
            <div style={{ display: 'grid', gap: 8, maxHeight: 280, overflowY: 'auto' }}>
              {sessions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => { setSession(s); setSelectedQuestionId(s.questions?.[0]?.questionId || null); }}
                  style={{
                    textAlign: 'left',
                    borderRadius: 10,
                    border: `1px solid ${session?._id === s._id ? '#06b6d4' : t.border}`,
                    background: session?._id === s._id ? 'rgba(6,182,212,0.1)' : t.elevated,
                    color: t.textPrimary,
                    padding: 10,
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 12.5, fontWeight: 700 }}>{s.role} · {s.industry}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 3 }}>
                    {s.status === 'completed' ? `Grade ${s.scores?.overallGrade || 0}` : 'In progress'} · {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockArena;
