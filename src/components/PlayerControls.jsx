"use client"

export default function PlayerControls({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onSeek,
  currentTime,
  duration,
  loop,
  onToggleLoop,
  shuffle,
  onToggleShuffle,
}) {
  const formatTime = (time) => {
    if (Number.isNaN(time)) return "00:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressChange = (e) => {
    onSeek(Number.parseFloat(e.target.value))
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "20px",
          gap: "10px",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            color: "#00ff41",
            fontWeight: "bold",
            minWidth: "45px",
            textShadow: "0 0 5px #00ff41",
          }}
        >
          {formatTime(currentTime)}
        </span>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime || 0}
            onChange={handleProgressChange}
            style={{
              width: "100%",
              height: "8px",
              background: `linear-gradient(to right, #00ff41 0%, #00ff41 ${(currentTime / duration) * 100}%, #0a0e27 ${(currentTime / duration) * 100}%, #0a0e27 100%)`,
              border: "2px solid #00ff41",
              borderRadius: "4px",
              outline: "none",
              cursor: "pointer",
              WebkitAppearance: "none",
              appearance: "none",
            }}
          />
        </div>
        <span
          style={{
            fontSize: "12px",
            color: "#00ff41",
            fontWeight: "bold",
            minWidth: "45px",
            textShadow: "0 0 5px #00ff41",
          }}
        >
          {formatTime(duration)}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          onClick={onToggleShuffle}
          style={{
            background: shuffle
              ? "linear-gradient(180deg, #ffff00 0%, #cccc00 100%)"
              : "linear-gradient(180deg, #333366 0%, #1a1a2e 100%)",
            color: shuffle ? "#000" : "#00ff41",
            border: `2px solid ${shuffle ? "#ffff00" : "#00ff41"}`,
            borderRadius: "4px",
            width: "45px",
            height: "45px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: shuffle ? "0 0 15px rgba(255, 255, 0, 0.6)" : "0 0 10px rgba(0, 255, 65, 0.3)",
            transition: "all 0.2s",
          }}
          title="Shuffle"
        >
          ⤨
        </button>

        <button
          onClick={onPrevious}
          style={{
            background: "linear-gradient(180deg, #00ffff 0%, #0099cc 100%)",
            color: "#000",
            border: "2px solid #00ffff",
            borderRadius: "4px",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
            transition: "all 0.2s",
          }}
        >
          ⏮
        </button>

        <button
          onClick={onPlayPause}
          style={{
            background: isPlaying
              ? "linear-gradient(180deg, #650000ff 0%, #5f0202ff 100%)"
              : "linear-gradient(180deg, #00ff41 0%, #00cc33 100%)",
            color: "#000",
            border: `3px solid ${isPlaying ? "#650000ff" : "#00ff41"}`,
            borderRadius: "50%",
            width: "70px",
            height: "70px",
            cursor: "pointer",
            fontSize: "28px",
            fontWeight: "bold",
            boxShadow: isPlaying ? "0 0 25px rgba(101, 0, 0, 0.8)" : "0 0 25px rgba(0, 255, 65, 0.8)",
            transition: "all 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          onClick={onNext}
          style={{
            background: "linear-gradient(180deg, #00ffff 0%, #0099cc 100%)",
            color: "#000",
            border: "2px solid #00ffff",
            borderRadius: "4px",
            width: "50px",
            height: "50px",
            cursor: "pointer",
            fontSize: "20px",
            fontWeight: "bold",
            boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)",
            transition: "all 0.2s",
          }}
        >
          ⏭
        </button>

        <button
          onClick={onToggleLoop}
          style={{
            background: loop
              ? "linear-gradient(180deg, #ffff00 0%, #cccc00 100%)"
              : "linear-gradient(180deg, #333366 0%, #1a1a2e 100%)",
            color: loop ? "#000" : "#00ff41",
            border: `2px solid ${loop ? "#ffff00" : "#00ff41"}`,
            borderRadius: "4px",
            width: "45px",
            height: "45px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            boxShadow: loop ? "0 0 15px rgba(255, 255, 0, 0.6)" : "0 0 10px rgba(0, 255, 65, 0.3)",
            transition: "all 0.2s",
          }}
          title="Loop"
        >
          ⟲
        </button>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #00ff41;
          border: 2px solid #000;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px #00ff41;
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #00ff41;
          border: 2px solid #000;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px #00ff41;
        }
      `}</style>
    </div>
  )
}
