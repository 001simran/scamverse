/*
 * ScamVerse - HackMol 7.0
 * ElderScenarioModal.jsx - elder version with animations
 * Jaspreet built this
 * updated with typing animation + sounds + feedback
 */

import { useState, useEffect } from 'react'
import { useGame } from '../game/GameContext'
import { getScenario, analyzeMessage } from '../utils/api'
import ElderVoice from './ElderVoice'
import { ElderDecisionButtons } from './ElderControls'

// ── SOUND EFFECTS ─────────────────────────────────────────
function playSound(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)()
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        if (type === 'correct') {
            osc.frequency.setValueAtTime(523, ctx.currentTime)
            osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1)
            osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2)
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.4)
        }

        if (type === 'wrong') {
            osc.frequency.setValueAtTime(300, ctx.currentTime)
            osc.frequency.setValueAtTime(150, ctx.currentTime + 0.2)
            gain.gain.setValueAtTime(0.3, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.4)
        }

        if (type === 'message') {
            osc.frequency.setValueAtTime(880, ctx.currentTime)
            osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08)
            gain.gain.setValueAtTime(0.15, ctx.currentTime)
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
            osc.start(ctx.currentTime)
            osc.stop(ctx.currentTime + 0.2)
        }

        if (type === 'levelup') {
            const now = ctx.currentTime
            const notes = [523.25, 659.25, 783.99, 1046.50] // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc2 = ctx.createOscillator()
                const gain2 = ctx.createGain()
                osc2.type = 'triangle'
                osc2.frequency.setValueAtTime(freq, now + idx * 0.1)
                gain2.gain.setValueAtTime(0.3, now + idx * 0.1)
                gain2.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.3)
                osc2.connect(gain2)
                gain2.connect(ctx.destination)
                osc2.start(now + idx * 0.1)
                osc2.stop(now + idx * 0.1 + 0.3)
            })
        }
    } catch (e) {
        console.log('sound not supported', e)
    }
}

// ── FALLBACK ──────────────────────────────────────────────
const FALLBACK = {
    type: 'OTP_SCAM',
    mission: 'The Blocked Account',
    sender: 'SBI-ALERT',
    message: 'Aapka SBI account 24 ghante mein band ho jayega. OTP batayein turant. Call karein: 09876543210',
    is_scam: true,
    clues: [
        'Bank kabhi OTP nahi maangti phone pe — yeh RBI ki policy hai',
        'Yeh number official nahi hai — SBI ka toll-free 1800-11-2211 hai',
        'Jaldi karne ka pressure fraud ki sabse badi nishani hai'
    ],
    explanation: 'Yeh KYC fraud hai. Real SBI KYC sirf branch ya official app mein hoti hai. Kabhi bhi OTP share mat karein.',
    reported_cases: 4521,
    avg_loss: 45000,
    source: 'RBI Annual Cyber Fraud Report 2024'
}

export default function ElderScenarioModal({ building, onClose }) {
    const { state, dispatch } = useGame()

    const [scenario, setScenario] = useState(null)
    const [loading, setLoading] = useState(true)
    const [decision, setDecision] = useState(null)
    const [revealedClues, setRevealedClues] = useState([])
    const [aiResult, setAiResult] = useState(null)

    // typing animation
    const [displayedMsg, setDisplayedMsg] = useState('')
    const [msgDone, setMsgDone] = useState(false)

    // feedback
    const [showXP, setShowXP] = useState(false)
    const [redFlash, setRedFlash] = useState(false)
    const [autoReadDone, setAutoReadDone] = useState(false)

    // level up state
    const [prevLevel, setPrevLevel] = useState(state.level)
    const [showLevelUp, setShowLevelUp] = useState(false)

    useEffect(() => {
        loadScenario()
        return () => ElderVoice.stop()
    }, [])

    // watch for level up
    useEffect(() => {
        if (state.level > prevLevel) {
            playSound('levelup')
            setShowLevelUp(true)
            setPrevLevel(state.level)

            // auto announce level up in voice
            setTimeout(() => {
                ElderVoice.stop()
                ElderVoice.speak(`Badhai ho! Aapka star badh gaya hai. Ab aap ${state.rank} ban gaye hain.`)
            }, 500)
        }
    }, [state.level, prevLevel, state.rank])

    // typing effect + auto voice read when scenario loads
    useEffect(() => {
        if (!scenario) return

        // play notification sound
        playSound('message')

        setDisplayedMsg('')
        setMsgDone(false)
        setAutoReadDone(false)

        let i = 0
        // slower typing for elder mode
        const speed = 28

        const interval = setInterval(() => {
            setDisplayedMsg(scenario.message.slice(0, i + 1))
            i++
            if (i >= scenario.message.length) {
                clearInterval(interval)
                setMsgDone(true)

                // auto read aloud after typing finishes
                if (!autoReadDone) {
                    setAutoReadDone(true)
                    setTimeout(() => {
                        ElderVoice.sayScenario(scenario.message, scenario.sender)
                    }, 500)
                }
            }
        }, speed)

        return () => clearInterval(interval)
    }, [scenario])

    async function loadScenario() {
        setLoading(true)

        const typeMap = {
            home: 'OTP_SCAM',
            bank: 'PHISHING',
            bazaar: 'UPI_TRAP',
            cybercell: 'DIGITAL_ARREST'
        }

        const scamType = typeMap[building?.id] || null

        try {
            const data = await getScenario(state.playerName, scamType)
            if (data && data.message) {
                setScenario(data)
            } else {
                setScenario({ ...FALLBACK })
            }
        } catch {
            setScenario({ ...FALLBACK })
        }

        setLoading(false)
    }

    async function handleDecision(choice) {
        if (decision || !msgDone) return
        setDecision(choice)
        setRevealedClues(scenario.clues.map((_, i) => i))

        const isCorrect = scenario.is_scam
            ? (choice === 'report' || choice === 'ignore')
            : choice === 'trust'

        if (isCorrect) {
            playSound('correct')
            setShowXP(true)
            dispatch({ type: 'CORRECT_ANSWER', payload: 100 })
            ElderVoice.sayCorrect(scenario.explanation)
            setTimeout(() => setShowXP(false), 2000)
        } else {
            playSound('wrong')
            setRedFlash(true)
            dispatch({ type: 'WRONG_ANSWER' })
            ElderVoice.sayWrong(scenario.explanation)
            setTimeout(() => setRedFlash(false), 700)
        }
    }

    async function handleAIHelp() {
        if (aiResult || !msgDone) return
        ElderVoice.speak('AI analysis kar raha hoon. Ek second ruko.')

        try {
            const result = await analyzeMessage(
                scenario.message,
                state.playerName
            )
            if (result) {
                setAiResult(result)
                setRevealedClues(scenario.clues.map((_, i) => i))
                ElderVoice.speak(
                    `AI ka jawab hai: ${result.verdict}. ${result.explanation || ''} ${result.what_to_do || ''}`
                )
            } else {
                const fallbackResult = {
                    verdict: scenario.is_scam ? 'SCAM' : 'SAFE',
                    confidence: 90,
                    flags: scenario.clues,
                    explanation: scenario.explanation,
                    what_to_do: '1930 pe call karein agar doubt ho.',
                    source: 'Pattern Analysis'
                }
                setAiResult(fallbackResult)
                setRevealedClues(scenario.clues.map((_, i) => i))
                ElderVoice.speak(`AI ka jawab: ${fallbackResult.verdict}. ${fallbackResult.explanation}`)
            }
        } catch {
            setAiResult({
                verdict: scenario.is_scam ? 'SCAM' : 'SAFE',
                confidence: 85,
                flags: scenario.clues,
                explanation: scenario.explanation,
                what_to_do: '1930 pe call karein.',
                source: 'Pattern Analysis'
            })
        }
    }

    function readAgain() {
        ElderVoice.stop()
        setTimeout(() => {
            ElderVoice.sayScenario(scenario.message, scenario.sender)
        }, 200)
    }

    // ── LOADING ───────────────────────────────────────────────
    if (loading) {
        return (
            <div style={ov}>
                <div style={modal}>
                    <div style={{ textAlign: 'center', padding: '48px' }}>
                        <div style={{
                            fontSize: '48px',
                            marginBottom: '12px',
                            animation: 'spin 1s linear infinite',
                            display: 'inline-block'
                        }}>
                            ⏳
                        </div>
                        <div style={{ color: '#ff9800', fontSize: '18px', fontWeight: 'bold' }}>
                            Loading...
                        </div>
                    </div>
                </div>
                <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    const isCorrect = decision && (
        scenario.is_scam
            ? (decision === 'report' || decision === 'ignore')
            : decision === 'trust'
    )

    const verdictColor = {
        SCAM: '#f44336',
        SAFE: '#4caf50',
        SUSPICIOUS: '#ff9800'
    }

    // ── RENDER ────────────────────────────────────────────────
    return (
        <div style={ov}>

            {/* red flash when wrong */}
            {redFlash && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(244,67,54,0.35)',
                    pointerEvents: 'none',
                    zIndex: 999,
                    borderRadius: '20px',
                    animation: 'flash 0.7s ease-out'
                }} />
            )}

            {/* +XP popup */}
            {showXP && (
                <div style={{
                    position: 'absolute',
                    top: '25%', left: '50%',
                    transform: 'translateX(-50%)',
                    color: '#4caf50',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    animation: 'floatUp 2s ease-out forwards',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    textShadow: '0 0 15px #4caf50',
                    whiteSpace: 'nowrap'
                }}>
                    +100 XP ✅ शाबाश!
                </div>
            )}

            {/* level up celebratory popup */}
            {showLevelUp && (
                <div style={levelUpOv}>
                    <div style={levelUpCard}>
                        <div style={{ fontSize: '80px', marginBottom: '20px', animation: 'bounce 1s infinite' }}>
                            🏆
                        </div>
                        <div style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            color: '#ffd700',
                            marginBottom: '10px',
                            textShadow: '0 0 20px rgba(255,215,0,0.5)',
                            letterSpacing: '2px'
                        }}>
                            बधाई हो!
                        </div>
                        <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#fff',
                            marginBottom: '20px'
                        }}>
                            आपका स्तर बढ़ गया है!
                        </div>

                        <div style={{
                            background: 'rgba(255,215,0,0.1)',
                            border: '2px solid #ffd700',
                            borderRadius: '16px',
                            padding: '20px',
                            marginBottom: '30px',
                            width: '100%'
                        }}>
                            <div style={{ color: '#aaa', fontSize: '14px', marginBottom: '5px' }}>
                                अब आपका रैंक है:
                            </div>
                            <div style={{
                                color: '#ffd700',
                                fontSize: '36px',
                                fontWeight: '900',
                                textTransform: 'uppercase'
                            }}>
                                {state.rank}
                            </div>
                            <div style={{ color: '#fff', fontSize: '18px', marginTop: '10px' }}>
                                स्तर {state.level}
                            </div>
                        </div>

                        <button
                            onClick={() => setShowLevelUp(false)}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: '#ffd700',
                                color: '#000',
                                border: 'none',
                                borderRadius: '14px',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(255,215,0,0.3)'
                            }}
                        >
                            ठीक है! आगे बढ़ें
                        </button>
                    </div>
                </div>
            )}

            <div style={modal}>

                {/* header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    borderBottom: '1px solid #2a2a4a',
                    flexWrap: 'wrap',
                    gap: '8px'
                }}>
                    <div style={{
                        color: '#ff9800',
                        fontSize: '16px',
                        fontWeight: 'bold'
                    }}>
                        📱 नया संदेश आया है
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={readAgain}
                            style={smallBtn('#4fc3f7')}
                        >
                            🔊 फिर सुनें
                        </button>
                        <button
                            onClick={() => { ElderVoice.stop(); onClose() }}
                            style={smallBtn('#f44336')}
                        >
                            ✕ बंद
                        </button>
                    </div>
                </div>

                {/* sender box */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: '#12122a',
                    margin: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #2a2a4a'
                }}>
                    <div style={{ fontSize: '32px' }}>📱</div>
                    <div>
                        <div style={{
                            color: '#fff',
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}>
                            {scenario.sender}
                        </div>
                        <div style={{ color: '#888', fontSize: '13px' }}>
                            से संदेश आया है
                        </div>
                    </div>
                    <div style={{
                        marginLeft: 'auto',
                        color: '#555',
                        fontSize: '11px'
                    }}>
                        {new Date().toLocaleTimeString('hi-IN', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </div>
                </div>

                {/* message with typing animation */}
                <div style={{
                    background: '#12122a',
                    border: '1px solid #2a2a4a',
                    borderRadius: '12px',
                    padding: '16px',
                    margin: '0 16px 12px',
                    minHeight: '80px'
                }}>
                    <div style={{
                        color: '#fff',
                        fontSize: '17px',
                        lineHeight: '1.7',
                        fontWeight: '500'
                    }}>
                        {displayedMsg}
                        {!msgDone && (
                            <span style={{
                                display: 'inline-block',
                                width: '3px',
                                height: '18px',
                                background: '#ff9800',
                                marginLeft: '3px',
                                verticalAlign: 'middle',
                                animation: 'blink 0.7s ease-in-out infinite'
                            }} />
                        )}
                    </div>

                    {!msgDone && (
                        <div style={{
                            color: '#555',
                            fontSize: '12px',
                            marginTop: '8px',
                            fontStyle: 'italic'
                        }}>
                            संदेश पढ़ा जा रहा है...
                        </div>
                    )}

                    {msgDone && (
                        <div style={{
                            color: '#555',
                            fontSize: '11px',
                            marginTop: '8px'
                        }}>
                            🔊 संदेश पढ़ने के लिए ऊपर बटन दबाएं
                        </div>
                    )}
                </div>

                {/* stats */}
                {scenario.reported_cases > 0 && msgDone && (
                    <div style={{
                        padding: '8px 16px',
                        background: '#1a0a0a',
                        margin: '0 16px 10px',
                        borderRadius: '8px',
                        border: '1px solid #f4433630',
                        color: '#f44336',
                        fontSize: '13px',
                        animation: 'fadeIn 0.5s ease-out'
                    }}>
                        ⚠️ इस तरह के{' '}
                        <strong>{scenario.reported_cases?.toLocaleString()}</strong>{' '}
                        केस हर महीने — औसत नुकसान ₹{scenario.avg_loss?.toLocaleString()}
                    </div>
                )}

                {/* clues */}
                {revealedClues.length > 0 && (
                    <div style={{ padding: '0 16px 10px' }}>
                        <div style={{
                            color: '#f44336',
                            fontSize: '15px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            🚩 संदिग्ध बातें:
                        </div>
                        {scenario.clues.map((clue, i) =>
                            revealedClues.includes(i) && (
                                <div key={i} style={{
                                    background: '#1a0505',
                                    border: '1px solid #f4433640',
                                    borderRadius: '8px',
                                    padding: '10px 12px',
                                    color: '#f44336',
                                    fontSize: '15px',
                                    marginBottom: '6px',
                                    lineHeight: '1.5',
                                    animation: 'slideIn 0.3s ease-out'
                                }}>
                                    ⚠️ {clue}
                                </div>
                            )
                        )}
                    </div>
                )}

                {/* AI result */}
                {aiResult && (
                    <div style={{
                        background: '#0a0020',
                        border: '1px solid #9c27b040',
                        borderRadius: '12px',
                        padding: '14px',
                        margin: '0 16px 12px',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{
                            color: '#9c27b0',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            🤖 AI का विश्लेषण:
                        </div>

                        {/* confidence bar */}
                        <div style={{
                            height: '6px',
                            background: '#1a1a2e',
                            borderRadius: '3px',
                            marginBottom: '10px',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${aiResult.confidence}%`,
                                background: verdictColor[aiResult.verdict] || '#4fc3f7',
                                borderRadius: '3px',
                                transition: 'width 1s ease-out'
                            }} />
                        </div>

                        <div style={{
                            color: verdictColor[aiResult.verdict] || '#fff',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            {aiResult.verdict === 'SCAM'
                                ? '🚨 यह फ्रॉड है!'
                                : aiResult.verdict === 'SAFE'
                                    ? '✅ यह सही लगता है'
                                    : '⚠️ संदिग्ध है'}
                            {' '}({aiResult.confidence}%)
                        </div>

                        <div style={{
                            color: '#ccc',
                            fontSize: '15px',
                            lineHeight: '1.6',
                            marginBottom: '8px'
                        }}>
                            {aiResult.explanation}
                        </div>

                        {aiResult.what_to_do && (
                            <div style={{
                                color: '#4fc3f7',
                                fontSize: '15px',
                                fontWeight: 'bold'
                            }}>
                                ✅ {aiResult.what_to_do}
                            </div>
                        )}

                        <div style={{
                            color: '#555',
                            fontSize: '11px',
                            marginTop: '6px'
                        }}>
                            {aiResult.source}
                        </div>
                    </div>
                )}

                {/* result after decision */}
                {decision && (
                    <div style={{
                        borderRadius: '12px',
                        border: `2px solid ${isCorrect ? '#4caf50' : '#f44336'}`,
                        background: isCorrect ? '#0a1a0a' : '#1a0a0a',
                        padding: '16px',
                        margin: '0 16px 12px',
                        animation: 'slideIn 0.3s ease-out'
                    }}>
                        <div style={{
                            color: isCorrect ? '#4caf50' : '#f44336',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            marginBottom: '8px'
                        }}>
                            {isCorrect ? '✅ शाबाश! सही जवाब!' : '❌ गलत जवाब'}
                        </div>
                        <div style={{
                            color: '#ddd',
                            fontSize: '15px',
                            lineHeight: '1.6'
                        }}>
                            {scenario.explanation}
                        </div>
                        {scenario.source && (
                            <div style={{
                                color: '#666',
                                fontSize: '12px',
                                marginTop: '8px'
                            }}>
                                स्रोत: {scenario.source}
                            </div>
                        )}
                    </div>
                )}

                {/* buttons */}
                <div style={{ padding: '12px 16px' }}>
                    {!decision ? (
                        <>
                            {/* helper buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '12px'
                            }}>
                                <button
                                    onClick={readAgain}
                                    disabled={!msgDone}
                                    style={{
                                        flex: 1, padding: '12px',
                                        background: '#12122a',
                                        border: '1px solid #2a2a4a',
                                        borderRadius: '10px',
                                        color: msgDone ? '#4fc3f7' : '#555',
                                        fontSize: '14px',
                                        cursor: msgDone ? 'pointer' : 'not-allowed',
                                        fontFamily: 'Arial, sans-serif'
                                    }}
                                >
                                    🔊 फिर सुनें
                                </button>
                                <button
                                    onClick={handleAIHelp}
                                    disabled={!!aiResult || !msgDone}
                                    style={{
                                        flex: 1, padding: '12px',
                                        background: '#12122a',
                                        border: '1px solid #2a2a4a',
                                        borderRadius: '10px',
                                        color: aiResult || !msgDone ? '#555' : '#9c27b0',
                                        fontSize: '14px',
                                        cursor: aiResult || !msgDone ? 'not-allowed' : 'pointer',
                                        fontFamily: 'Arial, sans-serif'
                                    }}
                                >
                                    🤖 AI मदद
                                </button>
                            </div>

                            {/* waiting message */}
                            {!msgDone && (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#555',
                                    fontSize: '13px',
                                    marginBottom: '10px',
                                    fontStyle: 'italic'
                                }}>
                                    संदेश पूरा होने तक प्रतीक्षा करें...
                                </div>
                            )}

                            {/* big decision buttons */}
                            <div style={{ opacity: msgDone ? 1 : 0.4 }}>
                                <ElderDecisionButtons
                                    onDecide={handleDecision}
                                    disabled={!msgDone}
                                />
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={() => { ElderVoice.stop(); onClose() }}
                            style={{
                                width: '100%',
                                padding: '18px',
                                background: '#4caf5020',
                                border: '2px solid #4caf50',
                                borderRadius: '14px',
                                color: '#4caf50',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                fontFamily: 'Arial, sans-serif'
                            }}
                        >
                            ✅ आगे बढ़ें
                        </button>
                    )}
                </div>

                {/* emergency always visible */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: '#1a0a0a',
                    borderTop: '1px solid #f4433630',
                    borderRadius: '0 0 18px 18px',
                    fontSize: '14px'
                }}>
                    <span style={{ color: '#f44336', fontWeight: 'bold' }}>
                        🆘 साइबर फ्रॉड हो तो:
                    </span>
                    <span style={{
                        color: '#ffd700',
                        fontSize: '20px',
                        fontWeight: 'bold'
                    }}>
                        1930
                    </span>
                </div>

            </div>

            {/* all animations */}
            <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes floatUp {
          0%   { transform: translateX(-50%) translateY(0);    opacity: 1; }
          100% { transform: translateX(-50%) translateY(-80px); opacity: 0; }
        }
        @keyframes flash {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes slideIn {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

        </div>
    )
}

// ── HELPERS ───────────────────────────────────────────────
const ov = {
    position: 'fixed', inset: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1000,
    padding: '12px', fontFamily: 'Arial, sans-serif'
}

const modal = {
    background: '#0d0d2a',
    border: '2px solid #ff9800',
    borderRadius: '20px',
    width: '100%', maxWidth: '440px',
    maxHeight: '92vh', overflowY: 'auto',
    fontFamily: 'Arial, sans-serif',
    position: 'relative'
}

function smallBtn(color) {
    return {
        background: color + '20',
        border: `1px solid ${color}`,
        borderRadius: '20px',
        color: color,
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        fontFamily: 'Arial, sans-serif'
    }
}

const levelUpOv = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.95)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderRadius: '20px',
    animation: 'fadeIn 0.5s ease-out'
}

const levelUpCard = {
    background: '#12122a',
    border: '3px solid #ffd700',
    borderRadius: '24px',
    padding: '40px 30px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '380px',
    boxShadow: '0 0 50px rgba(255,215,0,0.2)',
    animation: 'slideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
}