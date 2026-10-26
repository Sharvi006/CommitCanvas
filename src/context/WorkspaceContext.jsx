import React, { createContext, useContext, useState } from 'react';

const WorkspaceContext = createContext(null);

export function WorkspaceProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [terminalHeight, setTerminalHeight] = useState(220);
  const [zoomLevel, setZoomLevel] = useState(1);

  const toggleSound = () => setSoundEnabled(prev => !prev);

  return (
    <WorkspaceContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        terminalHeight,
        setTerminalHeight,
        zoomLevel,
        setZoomLevel,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return ctx;
}

export default WorkspaceContext;
