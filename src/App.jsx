import React, { useEffect } from 'react'
import useAudioPlayer from './hooks/useAudioPlayer'
import PlayerControls from './components/PlayerControls'
import PlaylistPanel from './components/PlaylistPanel'

export default function App() {
    const getSavedPlaylist = () => {
        const saved = localStorage.getItem('flowbeat_playlist')
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
        toggleShuffle
    } = useAudioPlayer(getSavedPlaylist())

    useEffect(() => {
        localStorage.setItem('flowbeat_playlist', JSON.stringify(playlist))
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
        if (playlist.length === 0 || currentIndex >= playlist.length) return 'No hay canción seleccionada'
        const path = playlist[currentIndex]
        const parts = path.split(/[/\\]/)
        return parts.at(-1)
    }

    return (
        <div style={{ 
            padding: 20,
            maxWidth: '800px',
            margin: '0 auto',
            fontFamily: 'Arial, sans-serif'
        }}>
            <h1 style={{ textAlign: 'center', color: '#2196F3' }}>FlowBeat Player</h1>
            
            <div style={{ 
                textAlign: 'center', 
                margin: '20px 0',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2>{getCurrentSongName()}</h2>
                {isPlaying ? (
                    <p style={{ color: '#4CAF50' }}>Reproduciendo</p>
                ) : (
                    <p style={{ color: '#9E9E9E' }}>Pausado</p>
                )}
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
            
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '10px',
                marginBottom: '20px' 
            }}>
                <button 
                    onClick={handleOpenFiles}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Importar canción(es)
                </button>
                <button 
                    onClick={handleOpenFolder}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Importar carpeta
                </button>
                <button 
                    onClick={clearPlaylist}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#F44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Limpiar lista
                </button>
            </div>
            
            <PlaylistPanel 
                playlist={playlist}
                currentIndex={currentIndex}
                onTrackSelect={playTrack}
            />
        </div>
    )
}
