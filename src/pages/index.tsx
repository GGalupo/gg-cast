import { GetStaticProps } from 'next'
import { format, parseISO } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/durationToTimeString'

import Image from 'next/image'

import styles from './home.module.scss'

type Episode = {
  id: string
  title: string
  thumbnail: string
  members: string
  publishedAt: string
  duration: number
  durationAsString: string
  description: string
  url: string
}

type HomeProps = {
  latestEpisodes: Episode[],
  olderEpisodes: Episode[]
}

export default function Home({ latestEpisodes, olderEpisodes }: HomeProps) {
  return (
    <div className={styles.homePage}>
      <section className={styles.latestEpisodes}>
        <h2>New Podcasts</h2>
        <ul>
          {latestEpisodes.map(episode => {
            return (
              <li key={episode.id}>
                <Image 
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                  />

                <div className={styles.episodeDetails}>
                  <a href="">{episode.title}</a>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button">
                  <img src="/play-green.svg" alt="Play episode"/>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
      <section className={styles.olderEpisodes}>
          <h2>Older Podcasts</h2>
          <ul>
            {olderEpisodes.map(episode => {
              return (
                <li key={episode.id}>
                  <a href="">{episode.title}</a>
                </li>
              )
            })}
          </ul>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'MMM. d Y', { locale: enUS }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  const latestEpisodes = episodes.slice(0, 2)
  const olderEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latestEpisodes,
      olderEpisodes
    },
    revalidate: 60 * 60 * 6,
  }
}