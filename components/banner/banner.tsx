import styles from './Banner.module.css';

const Banner = (props) => {
  return (
  <div className={styles.container}>
    <h1 className={styles.headline}>
      <span className={styles.coffee}>Coffee</span> 
      <span className={styles.connoisseur}>Connoisseur</span>
    </h1>
    <p className={styles.paragraph}>Come and discover local coffee shops</p>
    <div className={styles.buttonWrapper}>
      <button className={styles.button} onClick={props.handleOnClick}>{props.buttonText}</button>
    </div>
  </div>
  )
}

export default Banner;