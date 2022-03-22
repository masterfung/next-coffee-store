import Head from 'next/head'
import Banner from '../components/banner/banner.tsx'
import styles from '../styles/Home.module.css'
import Image from 'next/image'
import Card from '../components/card/card.tsx'
import { fetchCoffeeData } from "../lib/coffee-stores.ts";
import retrieveUserLocation from "../hooks/retrieve-user-location.tsx";
import { useContext, useEffect, useState } from 'react';
import { StoreContext, ACTION_TYPES } from "../store/store-context";

export async function getStaticProps() {
  const coffeeStores = await fetchCoffeeData();

  return {
    props: { coffeeStores }, // will be passed to the page component as props
  }
}

export default function Home({coffeeStores}) {
  const [error, setError] = useState("");
  const { state, dispatch } = useContext(StoreContext);

  const {handleLocationData, errorStatus, isFindingLocation } =  retrieveUserLocation();
  const handleBannerBtnOnClick = () => {
    handleLocationData();
  };

  useEffect(() => {
    const init = async () => {
      const coffeeData = await fetchCoffeeData(state.latLong, "cafe", 30);
      dispatch({
        type: ACTION_TYPES.SET_COFFEE_STORES,
        payload: {
          coffeeStores: coffeeData
        }
      });
      setError("");
    }

    if (state.latLong) {
      try {
        init();
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    }
  }, [state.latLong, dispatch])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Find amazing coffee places nearby or user-ranked" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? "Loading..." : "View Stores Nearby"} handleOnClick={handleBannerBtnOnClick} />
        {errorStatus.length ? <p className={styles.error}>{errorStatus}</p> : null}
        {error.length ? <p className={styles.error}>{error}</p> : null}
        <div className={styles.heroImage}>
          <Image src="/static/coffee.png" width={700} alt="coffee" height={400} />
        </div>
        {
          state.coffeeStores.length > 0 && (
            <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionHeading}>Your Nearby Coffee Stores</h2>
            <div className={styles.cardLayout}>
              { state.coffeeStores.map(({id, name, imgUrl}) => <Card 
              key={id}
              name={name}
              imgUrl={imgUrl} 
              imageName={name}
              className={styles.card}
              href={`/coffee-store/${id}`} />
              )}
            </div>
          </div>
          )
        }
        { coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.sectionHeading}>San Francisco Stores</h2>
            <div className={styles.cardLayout}>
              { coffeeStores.map(({id, name, imgUrl}) => <Card 
              key={id}
              name={name}
              imgUrl={imgUrl} 
              imageName={name}
              className={styles.card}
              href={`/coffee-store/${id}`} />
              )}
            </div>
          </div>
        )}
        
      </main>
    </div>
  )
}
