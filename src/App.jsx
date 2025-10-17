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
        width: "99vw",
        height: "98vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #2a2a30 0%, #1a1a20 100%)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(180deg, #4a4a52 0%, #3a3a42 100%)",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #555",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              background: "#666",
              border: "2px solid #888",
              transform: "rotate(45deg)",
            }}
          />
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#ccc",
              letterSpacing: "2px",
            }}
          >
            FLOWBEAT
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ width: "14px", height: "14px", background: "#888", border: "1px solid #666", borderRadius: "2px" }} />
          <div style={{ width: "14px", height: "14px", background: "#777", border: "1px solid #666", borderRadius: "2px" }} />
          <div style={{ width: "14px", height: "14px", background: "#666", border: "1px solid #555", borderRadius: "2px" }} />
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "30px 40px",
          gap: "30px",
          overflow: "auto",
        }}
      >
        <div
          style={{
            padding: "30px",
            background: "#1a1a22",
            border: "2px solid #444",
            borderRadius: "8px",
            minHeight: "150px",
            boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "4px", alignItems: "flex-end", height: "40px" }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "6px",
                    height: isPlaying ? `${25 + Math.random() * 15}px` : "8px",
                    background: "#888",
                    transition: "height 0.15s",
                    animation: isPlaying ? `pulse ${0.4 + i * 0.1}s infinite alternate` : "none",
                    borderRadius: "2px",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                fontSize: "18px",
                color: "#aaa",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontWeight: "500",
              }}
            >
              {getCurrentSongName()}
            </div>
          </div>

          <div
            style={{
              fontSize: "14px",
              color: isPlaying ? "#999" : "#555",
              fontWeight: "bold",
              letterSpacing: "1.5px",
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

        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "0",
            maxWidth: "800px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <button
            onClick={handleOpenFiles}
            style={{
              flex: 1,
              padding: "14px",
              background: "linear-gradient(180deg, #555 0%, #444 100%)",
              color: "#ddd",
              border: "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 3px 0 #333, 0 2px 8px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #666 0%, #555 100%)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #555 0%, #444 100%)"
            }}
          >
            + FILES
          </button>
          <button
            onClick={handleOpenFolder}
            style={{
              flex: 1,
              padding: "14px",
              background: "linear-gradient(180deg, #555 0%, #444 100%)",
              color: "#ddd",
              border: "2px solid #666",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 3px 0 #333, 0 2px 8px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #666 0%, #555 100%)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #555 0%, #444 100%)"
            }}
          >
            + FOLDER
          </button>
          <button
            onClick={clearPlaylist}
            style={{
              flex: 1,
              padding: "14px",
              background: "linear-gradient(180deg, #644 0%, #533 100%)",
              color: "#ddd",
              border: "2px solid #755",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              fontFamily: "'Courier New', monospace",
              boxShadow: "0 3px 0 #422, 0 2px 8px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #755 0%, #644 100%)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #644 0%, #533 100%)"
            }}
          >
            CLEAR
          </button>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              padding: "14px 20px",
              background: isSidebarOpen
                ? "linear-gradient(180deg, #777 0%, #666 100%)"
                : "linear-gradient(180deg, #555 0%, #444 100%)",
              color: "#ddd",
              border: `2px solid ${isSidebarOpen ? "#888" : "#666"}`,
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              fontFamily: "'Courier New', monospace",
              boxShadow: isSidebarOpen
                ? "0 3px 0 #555, 0 2px 8px rgba(0, 0, 0, 0.3)"
                : "0 3px 0 #333, 0 2px 8px rgba(0, 0, 0, 0.3)",
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              transition: "all 0.2s",
            }}
          >
            QUEUE {playlist.length > 0 && `(${playlist.length})`}
          </button>
        </div>
      </div>

      <PlaylistPanel
        playlist={playlist}
        currentIndex={currentIndex}
        onTrackSelect={playTrack}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <style>{`
        @keyframes pulse {
          from { height: 8px; }
          to { height: 40px; }
        }
      `}</style>
    </div>
  )
}