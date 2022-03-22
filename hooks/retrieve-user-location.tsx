import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const retrieveUserLocation = () => {
  const [errorStatus, setErrorStatus] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = (position) => {
    setErrorStatus('');
    const latitude  = position.coords.latitude;
    const longitude = position.coords.longitude;
    dispatch({type: ACTION_TYPES.SET_LAT_LONG, payload: { latLong: `${latitude},${longitude}`}})
    setErrorStatus('');
    setIsFindingLocation(false);
  };
  const failure = () => {
    setErrorStatus('Error has occurred with geolocation');
    setIsFindingLocation(false);
  };

  const handleLocationData = () => {
    setIsFindingLocation(true);
    if(!navigator.geolocation) {
      setErrorStatus('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, failure);
    }
  }
  return {
    handleLocationData,
    errorStatus,
    isFindingLocation
  }
}

export default retrieveUserLocation;