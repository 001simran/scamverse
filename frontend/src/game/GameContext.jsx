// NetGuardian - Hackathon Integration
// GameContext.jsx - Professional state management using ProgressionSystem

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import ProgressionSystem from '../utils/gameProgression';
import { SCAMS } from '../utils/scamDatabase';

const GameContext = createContext(null);

export const INITIAL_STATE = {
  playerName: 'Guardian',
  currentView: 'game', // 'title', 'game', 'spin', 'analysis', 'dna', 'scenario'
  currentMission: null,
  showLearnMode: false,
  lastMissionResult: null,
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

  const value = {
    ...gameState,
    state: gameState, // For backward compatibility with some components
    progression,
    progressionData,
    setView,
    startMission,
    completeMission,
    closeLearnMode,
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