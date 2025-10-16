"use client"

import { useEffect, useState } from "react"
import useAudioPlayer from "./hooks/useAudioPlayer"
import PlayerControls from "./components/PlayerControls"
import PlaylistPanel from "./components/PlaylistPanel"

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const getSavedPlaylist = () => {
    const saved = localStorage.getItem("flowbeat_playlist")
    return saved ? JSON.parse(saved) : []
  }

  const {
    playlist,
    currentIndex,
    isPlaying,
    duration,
    currentTime,
    loop,
    shuffle,
    togglePlay,
    handlePrevious,
    handleNext,
    playTrack,
    seek,
    addToPlaylist,
    clearPlaylist,
    toggleLoop,
    toggleShuffle,
  } = useAudioPlayer(getSavedPlaylist())

  useEffect(() => {
    localStorage.setItem("flowbeat_playlist", JSON.stringify(playlist))
  }, [playlist])

  const handleOpenFiles = async () => {
    const paths = await globalThis.electronAPI.openFiles()
    addToPlaylist(paths)
  }

  const handleOpenFolder = async () => {
    const paths = await globalThis.electronAPI.openFolder()
    addToPlaylist(paths)
  }

  const getCurrentSongName = () => {
    if (playlist.length === 0 || currentIndex >= playlist.length) return "NO TRACK LOADED"
    const path = playlist[currentIndex]
    const parts = path.split(/[/\\]/)
    return parts.at(-1)
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Main Player Window */}
      <div
        style={{
          width: "500px",
          background: "linear-gradient(180deg, #2a2a4a 0%, #1a1a2e 100%)",
          border: "3px solid #00ff41",
          borderRadius: "12px",
          boxShadow: "0 0 30px rgba(0, 255, 65, 0.5), inset 0 0 20px rgba(0, 0, 0, 0.5)",
          fontFamily: "'Courier New', monospace",
          overflow: "hidden",
        }}
      >
        {/* Title Bar */}
        <div
          style={{
            background: "linear-gradient(180deg, #00ff41 0%, #00cc33 100%)",
            padding: "8px 15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #00ff41",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                background: "#ff00ff",
                border: "2px solid #000",
                transform: "rotate(45deg)",
              }}
            />
            <h1
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#000",
                textShadow: "1px 1px 0px rgba(255,255,255,0.5)",
                letterSpacing: "2px",
              }}
            >
              FLOWBEAT v2.0
            </h1>
          </div>
          <div style={{ display: "flex", gap: "5px" }}>
            <div style={{ width: "12px", height: "12px", background: "#ff00ff", border: "1px solid #000" }} />
            <div style={{ width: "12px", height: "12px", background: "#00ffff", border: "1px solid #000" }} />
            <div style={{ width: "12px", height: "12px", background: "#ffff00", border: "1px solid #000" }} />
          </div>
        </div>

        {/* Display Screen */}
        <div
          style={{
            margin: "20px",
            padding: "20px",
            background: "#0a0e27",
            border: "3px inset #00ff41",
            borderRadius: "4px",
            minHeight: "100px",
            boxShadow: "inset 0 0 20px rgba(0, 255, 65, 0.3)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              marginBottom: "15px",
            }}
          >
            {/* Animated Equalizer */}
            <div style={{ display: "flex", gap: "3px", alignItems: "flex-end", height: "30px" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "4px",
                    height: isPlaying ? `${20 + Math.random() * 10}px` : "5px",
                    background: "#00ff41",
                    transition: "height 0.1s",
                    animation: isPlaying ? `pulse ${0.3 + i * 0.1}s infinite alternate` : "none",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: "14px",
                color: "#00ff41",
                textShadow: "0 0 10px #00ff41",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {getCurrentSongName()}
            </div>
          </div>

          <div
            style={{
              fontSize: "12px",
              color: isPlaying ? "#ff00ff" : "#666",
              textShadow: isPlaying ? "0 0 8px #ff00ff" : "none",
              fontWeight: "bold",
              letterSpacing: "1px",
            }}
          >
            {isPlaying ? "▶ PLAYING" : "■ STOPPED"}
          </div>
        </div>

        <PlayerControls
          isPlaying={isPlaying}
          onPlayPause={togglePlay}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSeek={seek}
          currentTime={currentTime}
          duration={duration}
          loop={loop}
          onToggleLoop={toggleLoop}
          shuffle={shuffle}
          onToggleShuffle={toggleShuffle}
        />

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            padding: "15px 20px",
            background: "rgba(0, 0, 0, 0.3)",
            borderTop: "2px solid #00ff41",
          }}
        >
          <button
            onClick={handleOpenFiles}
            style={{
              flex: 1,
              padding: "10px",
              background: "linear-gradient(180deg, #00ffff 0%, #0099cc 100%)",
              color: "#000",
              border: "2px solid #00ffff",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 2px 0 #006699, 0 0 10px rgba(0, 255, 255, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            + FILES
          </button>
          <button
            onClick={handleOpenFolder}
            style={{
              flex: 1,
              padding: "10px",
              background: "linear-gradient(180deg, #00ffff 0%, #0099cc 100%)",
              color: "#000",
              border: "2px solid #00ffff",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 2px 0 #006699, 0 0 10px rgba(0, 255, 255, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            + FOLDER
          </button>
          <button
            onClick={clearPlaylist}
            style={{
              flex: 1,
              padding: "10px",
              background: "linear-gradient(180deg, #ff00ff 0%, #cc0099 100%)",
              color: "#000",
              border: "2px solid #ff00ff",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 2px 0 #990066, 0 0 10px rgba(255, 0, 255, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            CLEAR
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: "10px 15px",
              background: isSidebarOpen
                ? "linear-gradient(180deg, #ffff00 0%, #cccc00 100%)"
                : "linear-gradient(180deg, #00ff41 0%, #00cc33 100%)",
              color: "#000",
              border: `2px solid ${isSidebarOpen ? "#ffff00" : "#00ff41"}`,
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "11px",
              fontFamily: "'Courier New', monospace",
              boxShadow: isSidebarOpen
                ? "0 2px 0 #999900, 0 0 10px rgba(255, 255, 0, 0.5)"
                : "0 2px 0 #009922, 0 0 10px rgba(0, 255, 65, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            QUEUE
          </button>
        </div>
      </div>

      {/* Sliding Sidebar Playlist */}
      <PlaylistPanel
        playlist={playlist}
        currentIndex={currentIndex}
        onTrackSelect={playTrack}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* CSS Animation */}
      <style>{`
                @keyframes pulse {
                    from { height: 5px; }
                    to { height: 30px; }
                }
            `}</style>
    </div>
  )
}
