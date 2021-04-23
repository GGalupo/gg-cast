import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { api } from '../../services/api'

import enUS from 'date-fns/locale/en-US'
import { format, parseISO } from 'date-fns'
import { convertDurationToTimeString } from '../../utils/durationToTimeString'

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

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const router = useRouter()

    return (
        <h1>{router.query.epname}</h1>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { epname } = context.params

    const { data } = await api.get(`/episodes/${epname}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'MMM d Y', { locale: enUS }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 // 24h
    }
}
