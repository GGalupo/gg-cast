import { useContext, useRef, useEffect } from 'react'
import Image from 'next/image'
import Slider from 'rc-slider'

import { PlayerContext } from '../../contexts/PlayerContext'

import 'rc-slider/assets/index.css'
import styles from './styles.module.scss'


export function Player() {
    const audioRef = useRef<HTMLAudioElement>(null)

    const { episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        setPlayingState,
        playNext,
        playPrevious,
        togglePlay
    } = useContext(PlayerContext)

    useEffect(() => {
        if(!audioRef.current) {
            return
        }

        if(isPlaying) {
            audioRef.current.play()
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying])

    const episode = episodeList[currentEpisodeIndex]

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Playing Now"/>
                <strong>Playing now</strong>
            </header>

            { episode ? (
                <div className={styles.playingEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Choose a podcast to listen</strong>
                </div>
            ) }


            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 3 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                        
                    </div>
                    <span>00:00</span>
                </div>
                
                { episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => { setPlayingState(true) }}
                        onPause={() => { setPlayingState(false) }}
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Shuffle"/>
                    </button>
                    <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Play Previous"/>
                    </button>
                    <button
                        type="button"
                        disabled={!episode}
                        className={styles.playButton}
                        onClick={togglePlay}
                    >
                        <img src={ isPlaying ? '/pause.svg' : '/play.svg'} alt="Play/Pause"/>
                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Play Next"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="Repeat"/>
                    </button>
                </div>
            </footer>
        </div>
    )
}