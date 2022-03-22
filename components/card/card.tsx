import styles from "./card.module.css";
import Image from "next/image";
import Link from "next/link";
import cls from 'classnames';

const Card = ({href, name, imgUrl, imageName}) => {
  return (
    <Link href={href} >
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeadWrapper}>
            <h2 className={styles.cardHeader}>{name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image className={styles.cardImage} src={imgUrl} alt={imageName} width={260} height={160} />
          </div>
        </div>
      </a>
    </Link>
  )
}

export default Card;