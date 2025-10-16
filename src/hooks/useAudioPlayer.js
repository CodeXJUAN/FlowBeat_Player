import { useState, useRef, useEffect } from 'react';

export default function useAudioPlayer(initialPlaylist = []) {
  const [playlist, setPlaylist] = useState(initialPlaylist);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };
    
    const handleEnded = () => {
      if (loop) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else {
        handleNext();
      }
    };
    
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleEnded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [loop]);

  useEffect(() => {
    if (playlist.length === 0) return;
    
    const loadAndPlay = async () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = playlist[currentIndex];
        
        try {
          if (isPlaying) {
            await audioRef.current.play();
          }
        } catch (error) {
          console.error('Error al reproducir:', error);
        }
      }
    };
    
    loadAndPlay();
  }, [currentIndex, playlist, isPlaying]);

  const togglePlay = () => {
    if (playlist.length === 0) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error('Error al reproducir:', err));
    }
    
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    if (playlist.length <= 1) return;
    
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex(prev => (prev === 0 ? playlist.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (playlist.length <= 1) return;
    
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentIndex(randomIndex);
    } else {
      setCurrentIndex(prev => (prev === playlist.length - 1 ? 0 : prev + 1));
    }
  };

  const playTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const addToPlaylist = (tracks) => {
    setPlaylist(prev => [...prev, ...tracks]);
  };

  const clearPlaylist = () => {
    setPlaylist([]);
    setCurrentIndex(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
  };

  const toggleLoop = () => {
    setLoop(prev => !prev);
  };

  const toggleShuffle = () => {
    setShuffle(prev => !prev);
  };

  return {
    playlist,
    currentIndex,
    currentTrack: playlist[currentIndex],
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
  };
}