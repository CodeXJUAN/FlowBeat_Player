"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export default function useAudioPlayer(initialPlaylist = []) {
  const [playlist, setPlaylist] = useState(initialPlaylist)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [loop, setLoop] = useState(false)
  const [shuffle, setShuffle] = useState(false)

  const audioRef = useRef(null)
  const isLoadingRef = useRef(false)

  // Initialize audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.preload = "metadata"
    }

    const audio = audioRef.current

    const handleLoadedMetadata = () => {
      console.log("Metadata loaded, duration:", audio.duration)
      setDuration(audio.duration || 0)
      isLoadingRef.current = false
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0)
    }

    const handleEnded = () => {
      console.log("Track ended")
      if (loop) {
        audio.currentTime = 0
        audio.play().catch(err => console.error("Error looping:", err))
      } else {
        handleNextTrack()
      }
    }

    const handleCanPlay = () => {
      console.log("Can play audio")
      isLoadingRef.current = false
    }

    const handleError = (e) => {
      console.error("Audio error:", e, audio.error)
      setIsPlaying(false)
      isLoadingRef.current = false
    }

    const handleLoadStart = () => {
      console.log("Load started")
      isLoadingRef.current = true
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("error", handleError)
    audio.addEventListener("loadstart", handleLoadStart)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.pause()
    }
  }, [])

  // Handle next track separately to avoid circular dependency
  const handleNextTrack = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = shuffle
        ? Math.floor(Math.random() * playlist.length)
        : prevIndex >= playlist.length - 1
        ? 0
        : prevIndex + 1
      return nextIndex
    })
  }, [playlist.length, shuffle])

  useEffect(() => {
    if (playlist.length === 0 || currentIndex >= playlist.length) {
      console.log("No valid track to load")
      return
    }

    const loadTrack = async () => {
      if (audioRef.current) {
        const wasPlaying = isPlaying
        audioRef.current.pause()
        audioRef.current.src = playlist[currentIndex].startsWith('file://')
          ? playlist[currentIndex]
          : `file://${playlist[currentIndex]}`
        audioRef.current.load()
    
        try {
          if (wasPlaying) {
            await audioRef.current.play()
          }
        } catch (error) {
          console.error("[v0] Error playing track:", error)
          setIsPlaying(false)
        }
      }
    }

    loadTrack()
  }, [currentIndex, playlist])

  const togglePlay = async () => {
    if (playlist.length === 0) {
      console.log("No tracks in playlist")
      return
    }

    if (!audioRef.current) {
      console.error("Audio ref not initialized")
      return
    }

    const audio = audioRef.current

    try {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
        console.log("Paused")
      } else {
        if (!audio.src || audio.src === "") {
          const trackPath = playlist[currentIndex];
          const encodedPath = encodeURI(trackPath).replace(/\\/g, '/');
          const audioSrc = `local-audio://${encodedPath}`;
          audio.src = audioSrc;
          audio.load()
          await new Promise(resolve => setTimeout(resolve, 100))
        }

        await audio.play()
        setIsPlaying(true)
        console.log("Playing")
      }
    } catch (err) {
      console.error("Toggle play error:", err)
      setIsPlaying(false)
    }
  }

  const handlePrevious = () => {
    if (playlist.length === 0) return

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentIndex(randomIndex)
    } else {
      setCurrentIndex((prev) => (prev === 0 ? playlist.length - 1 : prev - 1))
    }
  }

  const handleNext = () => {
    if (playlist.length === 0) return

    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length)
      setCurrentIndex(randomIndex)
    } else {
      setCurrentIndex((prev) => (prev === playlist.length - 1 ? 0 : prev + 1))
    }
  }

  const playTrack = (index) => {
    if (index >= 0 && index < playlist.length) {
      setCurrentIndex(index)
      setTimeout(() => setIsPlaying(true), 100)
    }
  }

  const seek = (time) => {
    if (audioRef.current && !Number.isNaN(time)) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const addToPlaylist = (tracks) => {
    if (tracks && tracks.length > 0) {
      console.log("Adding tracks:", tracks)
      setPlaylist((prev) => [...prev, ...tracks])
    }
  }

  const clearPlaylist = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }
    setPlaylist([])
    setCurrentIndex(0)
    setIsPlaying(false)
    setDuration(0)
    setCurrentTime(0)
  }

  const toggleLoop = () => {
    setLoop((prev) => !prev)
  }

  const toggleShuffle = () => {
    setShuffle((prev) => !prev)
  }

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
    toggleShuffle,
  }
}