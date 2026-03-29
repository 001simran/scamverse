// NetGuardian - Hackathon Integration
// GameContext.jsx - Professional state management using ProgressionSystem

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import ProgressionSystem from '../utils/gameProgression';
import { SCAMS } from '../utils/scamDatabase';

const GameContext = createContext(null);

export const INITIAL_STATE = {
  playerName: 'Guardian',
  currentView: 'game', 
  currentMission: null,
  showLearnMode: false,
  showDigitalArrest: false,
  showInfoCorner: false,
  showPhoneSim: false,
  showScamBuilder: false,
  showFamilyShield: false,
  showCertificate: false,
  certData: { score: 0, total: 4 },
  stressLevel: 0, // 0 to 100
  autoMoveTarget: null, // {x, z}
  lastMissionResult: null,
  isElderMode: false,
  showFailureCutscene: false,
  failureData: null,
  language: 'en', 
};

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState(INITIAL_STATE);
  
  // Initialize Progression System (persistent across renders)
  const progression = useMemo(() => new ProgressionSystem('player-1'), []);

  // Progression data for UI updates (derived state)
  const [progressionData, setProgressionData] = useState(progression.getFullProgressReport());

  const updateProgression = () => {
    setProgressionData(progression.getFullProgressReport());
  };

  const setView = (view) => {
    setGameState(prev => ({ ...prev, currentView: view }));
  };

  const startMission = (scamId) => {
    const mission = SCAMS[scamId];
    if (mission) {
      setGameState(prev => ({
        ...prev,
        currentMission: mission,
        currentView: 'game'
      }));
    }
  };

  const completeMission = (decision) => {
    if (!gameState.currentMission) return;

    // Record result in professional progression system
    progression.recordMissionResult(
      gameState.currentMission.id,
      `tier${gameState.currentMission.tier}`,
      {
        isCorrect: decision.isCorrect,
        xpGain: decision.xpGain,
        securityGain: decision.securityGain,
        citizenName: gameState.currentMission.victim.name,
        feedback: decision.feedback
      }
    );

    // If failed, trigger emotional cutscene instead of immediate learn mode
    if (!decision.isCorrect) {
      setGameState(prev => ({
        ...prev,
        showFailureCutscene: true,
        failureData: {
          scamType: prev.currentMission.id,
          amountLost: Math.floor(Math.random() * 900000) + 100000 // Randomized high-impact number
        },
        lastMissionResult: decision, // Store for later
        currentMission: null
      }));
      updateProgression();
      return;
    }

    // Check for achievements/rank ups
    progression.checkAndUnlockAchievements();
    updateProgression();

    setGameState(prev => ({
      ...prev,
      lastMissionResult: {
        ...decision,
        missionId: prev.currentMission.id
      },
      showLearnMode: true,
      currentMission: null
    }));
  };

  const closeLearnMode = () => {
    setGameState(prev => ({
      ...prev,
      showLearnMode: false,
      lastMissionResult: null
    }));
  };

  const closeFailureCutscene = () => {
    setGameState(prev => ({
      ...prev,
      showFailureCutscene: false,
      showLearnMode: true // Show educational content AFTER the emotional impact
    }));
  };

  const toggleElderMode = () => {
    setGameState(prev => ({
      ...prev,
      isElderMode: !prev.isElderMode
    }));
  };

  const toggleLanguage = () => {
    setGameState(prev => ({
      ...prev,
      language: prev.language === 'en' ? 'hi' : 'en'
    }));
  };

  const openDigitalArrest = () => setGameState(prev => ({ ...prev, showDigitalArrest: true }));
  const closeDigitalArrest = () => setGameState(prev => ({ ...prev, showDigitalArrest: false }));
  const openInfoCorner = () => setGameState(prev => ({ ...prev, showInfoCorner: true }));
  const closeInfoCorner = () => setGameState(prev => ({ ...prev, showInfoCorner: false }));
  const openPhoneSim = () => setGameState(prev => ({ ...prev, showPhoneSim: true }));
  const closePhoneSim = () => setGameState(prev => ({ ...prev, showPhoneSim: false }));
  const openScamBuilder = () => setGameState(prev => ({ ...prev, showScamBuilder: true }));
  const closeScamBuilder = () => setGameState(prev => ({ ...prev, showScamBuilder: false }));
  const openFamilyShield = () => setGameState(prev => ({ ...prev, showFamilyShield: true }));
  const closeFamilyShield = () => setGameState(prev => ({ ...prev, showFamilyShield: false }));
  const openCertificate = (data) => setGameState(prev => ({ ...prev, showCertificate: true, certData: data || prev.certData }));
  const closeCertificate = () => setGameState(prev => ({ ...prev, showCertificate: false }));
  const setStress = (level) => setGameState(prev => ({ ...prev, stressLevel: level }));
  const setAutoMoveTarget = (target) => setGameState(prev => ({ ...prev, autoMoveTarget: target }));

  const value = {
    ...gameState,
    state: gameState, 
    progression,
    progressionData,
    setView,
    startMission,
    completeMission,
    closeLearnMode,
    closeFailureCutscene,
    openDigitalArrest,
    closeDigitalArrest,
    openInfoCorner,
    closeInfoCorner,
    openPhoneSim,
    closePhoneSim,
    openScamBuilder,
    closeScamBuilder,
    openFamilyShield,
    closeFamilyShield,
    openCertificate,
    closeCertificate,
    setStress,
    setAutoMoveTarget,
    toggleElderMode,
    toggleLanguage,
    updateProgression
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};