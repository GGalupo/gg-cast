import format from 'date-fns/format'
import enUS from 'date-fns/locale/en-US'

import Link from 'next/link'

import styles from './styles.module.scss'

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, MMM. d', {
        locale: enUS,
    })

    return (
        <header className={styles.headerContainer}>
            <Link href={"/"}>
                <a>
                    <img src="/logo.svg" alt="Podcast Logo"/>
                </a>
            </Link>

            <p>The best podcasts for you!</p>

            <span>{currentDate}</span>
        </header>
    )
}