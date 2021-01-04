import { ADD_FEATURE, REMOVE_FEATURE } from "../action_types";

const initState = {
  features: [],
  viewPort: {
    lng: 138.2529,
    lat: 35.6762,
    zoom: 4,
  },
  bounds: [
    [117.43566530020553, 29.62319495524143],
    [156.9432257469175, 48.5611164165567],
  ],
};

export const featureReducer = (state = initState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ADD_FEATURE: {
      return {
        ...newState,
        features: [...newState.features, action.payload],
      };
    }
    case REMOVE_FEATURE: {
      return {
        ...newState,
        features: [
          ...newState.features.filter((feature) => feature !== action.payload),
        ],
      };
    }

    default:
      return state;
  }
};
