import { ADD_FEATURE } from "../action_types";

export const addFeatureAction = (feature) => {
  return {
    type: ADD_FEATURE,
    payload: feature,
  };
};

export const addFeature = (feature) => async (dispatch) => {
  dispatch(addFeatureAction(feature));
};
