

import { store } from '@/store/store';
import localeTranslations from './locale/en.json';
import { useJsApiLoader } from '@react-google-maps/api';
import { settingsData } from '@/store/reducer/settingsSlice';

// transalte strings 

export const translate = (label) => {
  const langLabel = store.getState().Language.languages.file_name &&
    store.getState().Language.languages.file_name[label];

  const enTranslation = localeTranslations;

  if (langLabel) {
    return langLabel;
  } else {
    return enTranslation[label];
  }
};

// is login user check
export const isLogin = () => {
  let user = store.getState()?.User_signup
  if (user) {
    try {
      if (user?.data?.token) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  }
  return false;
}


// Load Google Maps
export const loadGoogleMaps = () => {
  return useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API,
    libraries: ['geometry', 'drawing', 'places'], // Include 'places' library
  });
};

//  LOAD STRIPE API KEY 
export const loadStripeApiKey = () => {
  const STRIPEData = store.getState()?.Settings;
  const StripeKey = STRIPEData?.data?.stripe_publishable_key
  if (StripeKey) {
    ``
    return StripeKey
  }
  return false;
}


export const isDemoMode = (store) => {
  const systemSettingsData = settingsData(store);
  return systemSettingsData?.demo_mode || false;
};



// Function to format large numbers as strings with K, M, and B abbreviations
export const formatPriceAbbreviated = (price) => {
  if (price >= 1000000000) {
    return (price / 1000000000).toFixed(1) + 'B';
  } else if (price >= 1000000) {
    return (price / 1000000).toFixed(1) + 'M';
  } else if (price >= 1000) {
    return (price / 1000).toFixed(1) + 'K';
  } else {
    return price.toString();
  }
};


// Check if the theme color is true
export const isThemeEnabled = () => {
  const systemSettingsData = store.getState().Settings?.data
  return systemSettingsData?.svg_clr === '1';
};

export const formatNumberWithCommas = (number) => {
  return number.toLocaleString();
}; 