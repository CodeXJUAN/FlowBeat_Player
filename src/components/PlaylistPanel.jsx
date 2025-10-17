"use client"

export default function PlaylistPanel({ playlist, currentIndex, onTrackSelect, isOpen, onClose }) {
  const getFileName = (path) => {
    const parts = path.split(/[/\\]/)
    return parts[parts.length - 1]
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.7)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
          zIndex: 999,
        }}
      />

      {/* Sidebar Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "400px",
          height: "100vh",
          background: "linear-gradient(180deg, #2a2a4a 0%, #1a1a2e 100%)",
          border: "3px solid #7e7e7ec7",
          borderRight: "none",
          boxShadow: "-5px 0 30px rgba(97, 97, 97, 0.5)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(180deg, #7e7e7ec7 0%, #585858c7 100%)",
            padding: "15px 20px",
            borderBottom: "3px solid #7e7e7ec7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#000",
              textShadow: "1px 1px 0px rgba(255,255,255,0.5)",
              letterSpacing: "2px",
              margin: 0,
            }}
          >
            PLAYLIST QUEUE
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "#b7b7b7c7",
              color: "#000",
              border: "2px solid #000",
              borderRadius: "4px",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 10px rgba(183, 183, 183, 0.5)",
            }}
          >
            ×
          </button>
        </div>

        {/* Track Count */}
        <div
          style={{
            padding: "10px 20px",
            background: "rgba(0, 0, 0, 0.3)",
            borderBottom: "2px solid #7e7e7ec7",
            color: "#7e7e7ec7",
            fontSize: "12px",
            fontWeight: "bold",
            textShadow: "0 0 5px #7e7e7ec7",
          }}
        >
          {playlist.length} TRACK{playlist.length !== 1 ? "S" : ""} LOADED
        </div>

        {/* Playlist */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {playlist.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#666",
                fontSize: "14px",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "20px" }}>♪</div>
              <p>NO TRACKS IN QUEUE</p>
              <p style={{ fontSize: "12px", marginTop: "10px" }}>Import files to start playing</p>
            </div>
          ) : (
            <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
              {playlist.map((track, index) => (
                <li
                  key={index}
                  onClick={() => {
                    onTrackSelect(index)
                    onClose()
                  }}
                  style={{
                    padding: "12px 15px",
                    margin: "5px 0",
                    background:
                      index === currentIndex
                        ? "linear-gradient(90deg, rgba(0, 255, 65, 0.3) 0%, rgba(0, 255, 65, 0.1) 100%)"
                        : "rgba(0, 0, 0, 0.2)",
                    border: index === currentIndex ? "2px solid #00ff41" : "2px solid transparent",
                    borderRadius: "4px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.2s",
                    color: index === currentIndex ? "#00ff41" : "#999",
                    fontSize: "13px",
                    fontWeight: index === currentIndex ? "bold" : "normal",
                    textShadow: index === currentIndex ? "0 0 8px #00ff41" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (index !== currentIndex) {
                      e.currentTarget.style.background = "rgba(0, 255, 255, 0.1)"
                      e.currentTarget.style.borderColor = "#00ffff"
                      e.currentTarget.style.color = "#00ffff"
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (index !== currentIndex) {
                      e.currentTarget.style.background = "rgba(0, 0, 0, 0.2)"
                      e.currentTarget.style.borderColor = "transparent"
                      e.currentTarget.style.color = "#999"
                    }
                  }}
                >
                  <span
                    style={{
                      minWidth: "30px",
                      fontSize: "18px",
                    }}
                  >
                    {index === currentIndex ? "▶" : index + 1}
                  </span>
                  <span
                    style={{
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {getFileName(track)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}
