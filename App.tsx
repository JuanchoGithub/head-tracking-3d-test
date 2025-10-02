import React, { useState, useCallback } from 'react';
import Scene from './components/Scene';
import HeadTracker from './components/HeadTracker';
import Spinner from './components/Spinner';
import { HeadPosition, AppState, SceneType } from './types';
import SceneSelector from './components/SceneSelector';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.Idle);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [headPosition, setHeadPosition] = useState<HeadPosition>({ x: 0, y: 0 });
  const [currentScene, setCurrentScene] = useState<SceneType>('mirror');

  const handleStart = () => {
    setAppState(AppState.Loading);
  };

  const handleHeadMove = useCallback((position: HeadPosition) => {
    setHeadPosition(position);
  }, []);
  
  const handleTrackerLoaded = useCallback(() => {
      setAppState(AppState.Tracking);
  }, []);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setAppState(AppState.Error);
  }, []);

  const showActiveState = appState === AppState.Loading || appState === AppState.Tracking;

  return (
    <main className="w-screen h-screen flex items-center justify-center overflow-hidden bg-gray-900 font-sans">
      {appState === AppState.Idle && (
        <div className="text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600 mb-4">
            Head-Tracked Window Mode
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-300 mb-8">
            This demo uses your camera to track your head's movement, creating a 3D "window" effect without needing any special glasses.
          </p>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-sky-500 text-white font-bold rounded-lg shadow-lg shadow-sky-500/30 hover:bg-sky-400 transition-all duration-300 transform hover:scale-105"
          >
            Start Camera & Enter
          </button>
        </div>
      )}

      {appState === AppState.Loading && (
        <div className="flex flex-col items-center">
          <Spinner className="w-16 h-16" />
          <p className="mt-4 text-lg text-sky-300">Initializing...</p>
        </div>
      )}

      {appState === AppState.Error && (
        <div className="text-center bg-red-900/30 border border-red-500 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-2">An Error Occurred</h2>
          <p className="text-red-300">{errorMessage}</p>
          <button
            onClick={() => {
              setErrorMessage('');
              setAppState(AppState.Idle);
            }}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {showActiveState && (
        <>
          <div className={`w-full h-full absolute top-0 left-0 transition-opacity duration-1000 ${appState === AppState.Tracking ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <Scene headPosition={headPosition} scene={currentScene} />
          </div>
           {appState === AppState.Tracking && (
            <SceneSelector currentScene={currentScene} onSceneChange={setCurrentScene} />
          )}
          <HeadTracker 
            onHeadMove={handleHeadMove} 
            onLoaded={handleTrackerLoaded} 
            onError={handleError}
            isVisible={appState === AppState.Tracking}
          />
        </>
      )}
    </main>
  );
};

export default App;