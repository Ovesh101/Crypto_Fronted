import { useState } from "react";
import { useDispatch } from "react-redux";
import { removeUser } from "../../redux/features/UserSlice";

function useLocalStorage(key) {
  let initialValue = null;
let expiryInMilliseconds = 86400000;

const dispatch = useDispatch();
  const [storedValue, setStoredValue] = useState(() => {
   
    try {

     
      // Get item from localStorage
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      // Parse item to an object
      const parsedItem = JSON.parse(item);

      // Check if the item is expired
      if (new Date().getTime() > parsedItem.expiry) {
        // If expired, remove from localStorage
        window.localStorage.removeItem(key);
        dispatch(removeUser());
        return initialValue;
      }

      // If not expired, return the stored value
      return parsedItem.user_id;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValueWithExpiry = (value) => {
    try {
      const now = new Date();

      // Set expiry time (now + expiryInMilliseconds)
      const item = {
        user_id: value,
        expiry: now.getTime() + expiryInMilliseconds,
      };

      // Save the item in localStorage
      window.localStorage.setItem(key, JSON.stringify(item));

      // Update state
      setStoredValue(value);
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValueWithExpiry];
}

export default useLocalStorage;
