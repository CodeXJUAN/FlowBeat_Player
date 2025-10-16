import React from 'react';

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
  onToggleShuffle
}) {

  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  const handleProgressChange = (e) => {
    onSeek(parseFloat(e.target.value));
  };

  return (
    <div className="player-controls" style={{ 
      padding: '15px', 
      borderRadius: '8px', 
      backgroundColor: '#f5f5f5',
      marginTop: '20px',
      marginBottom: '20px'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ marginRight: '10px' }}>{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime || 0}
          onChange={handleProgressChange}
          style={{ flex: 1 }}
        />
        <span style={{ marginLeft: '10px' }}>{formatTime(duration)}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
        <button 
          onClick={onToggleShuffle}
          style={{ 
            backgroundColor: shuffle ? '#4CAF50' : '#e0e0e0',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer'
          }}
        >
          ⤨
        </button>
        <button 
          onClick={onPrevious}
          style={{ 
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer'
          }}
        >
          ⏮
        </button>
        <button 
          onClick={onPlayPause}
          style={{ 
            backgroundColor: '#2196F3',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer'
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <button 
          onClick={onNext}
          style={{ 
            backgroundColor: '#e0e0e0',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer'
          }}
        >
          ⏭
        </button>
        <button 
          onClick={onToggleLoop}
          style={{ 
            backgroundColor: loop ? '#4CAF50' : '#e0e0e0',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer'
          }}
        >
          ⟲
        </button>
      </div>
    </div>
  );
}