import React from 'react';

export default function PlaylistPanel({ playlist, currentIndex, onTrackSelect }) {
  const getFileName = (path) => {
    const parts = path.split(/[\/\\]/);
    return parts[parts.length - 1];
  };

  return (
    <div className="playlist-panel" style={{ 
      maxHeight: '300px', 
      overflowY: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '10px'
    }}>
      <h3>Lista de reproducción</h3>
      {playlist.length === 0 ? (
        <p>No hay canciones en la lista. Importa algunas canciones para comenzar.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {playlist.map((track, index) => (
            <li 
              key={index}
              onClick={() => onTrackSelect(index)}
              style={{
                padding: '8px 12px',
                margin: '4px 0',
                backgroundColor: index === currentIndex ? '#e3f2fd' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {index === currentIndex && (
                <span style={{ marginRight: '8px' }}>▶️</span>
              )}
              <span>{getFileName(track)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}