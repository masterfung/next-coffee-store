import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import styles from "../../styles/Coffee-Store.module.css";
import cls from "classnames";
import Image from "next/image";
import { fetchCoffeeData } from "../../lib/coffee-stores";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils/utils";
import { fetcher } from "../../lib/fetcher";
import useSWR from "swr";

interface CoffeeStore {
  id: string,
  name: string,
  address: string,
  voting: number,
  imgUrl: string,
  neighbourhood: string,
}

export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeData();
  const paths = coffeeStores.map(coffeeStore => {
    return {
      params: {
        id: coffeeStore.id.toString()
      }
    }
  })
  return {
    paths,
    fallback: true // false or 'blocking'
  };
}

export async function getStaticProps({params}) {
  const coffeeStores = await fetchCoffeeData();
  const findCoffeeStoreById = coffeeStores.find((coffeeStore: CoffeeStore) => coffeeStore.id.toString() === params.id);
  return {
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  };
}

const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore || {});
  const [votingCount, setVotingCount] = useState(0);
  
  const { 
    state: {
      coffeeStores
    }
  } = useContext(StoreContext);
  
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, neighbourhood, imgUrl, address }  = coffeeStore;
      if (id && name) {
        await fetch("/api/createCoffeeStore", {
          method: "POST",
          body: JSON.stringify({
            id,
            name,
            neighbourhood: neighbourhood || "",
            imgUrl,
            voting: 0,
            address: address || "",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          }
        });
      }
    } catch (error) {
      console.error(`An error has occurred with ${error}`);
    }
  }

  useEffect(() => {
    if (!router.isFallback) {
      if (isEmpty(initialProps.coffeeStore) && coffeeStores.length > 0) {
      const coffeeStoreFromContext = coffeeStores.find((coffeeStore: CoffeeStore) => coffeeStore.id.toString() === id);
      if (coffeeStoreFromContext) {
        setCoffeeStore(coffeeStoreFromContext);
        handleCreateCoffeeStore(coffeeStoreFromContext);
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }
    
  }, [id, initialProps, initialProps.coffeeStore, coffeeStores]);
  
  const {
    address = "",
    name = "",
    neighbourhood = "",
    imgUrl = "",
  } = coffeeStore;

  const {data, error} = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const handleUpVoteButton = async () => {
    try {
      const call = await fetch("/api/updateFavoriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({id})
      });
  
      const result = await call.json();
      if (result && result.length > 0) {
        setVotingCount(votingCount + 1);
      }
    } catch (error) {
      console.error("Something went wrong with the coffee store voting update", error);
    }

  }
 
  if (error) {
    return <div>Error with data retrieval</div>
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a className={styles.backToHomeLink}>
              &#8592; Return to home
              </a>
            </Link>  
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image 
          src={
            imgUrl ||
            "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          } 
          alt={name} 
          width={600} 
          height={360} 
          className={styles.storeImgWrapper}
           />
        </div>
        

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/marker.svg" width={24} alt="address icon" height={24} />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/neighborhood.svg" width={24} alt="neighbourhood icon" height={24} />
            <p className={styles.text}>{neighbourhood}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/heart.svg" width={24} alt="voting icon" height={24} />
            <p className={styles.text}>{votingCount}</p>
          </div>
          <button 
          onClick={handleUpVoteButton}
          className={styles.upVoteButton}
          >
            I love this place!
          </button>
        </div>

      </div>
    </div>
  )
}

export default CoffeeStore;