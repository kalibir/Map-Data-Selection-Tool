import { REMOVE_FEATURE } from "../action_types";

export const removeFeatureAction = (feature) => {
  return {
    type: REMOVE_FEATURE,
    payload: feature,
  };
};

export const removeFeature = (feature) => async (dispatch) => {
  dispatch(removeFeatureAction(feature));
};
