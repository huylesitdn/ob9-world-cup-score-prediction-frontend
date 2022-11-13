import axiosService from "utils/axiosServiceUtils";
import * as apiUrls from "./constantsApi";

export const getLastMatches = (data = '') => {
  return axiosService.getWithToken(`${apiUrls.API_GET_LAST_MATCHES}?${data}`);
};

export const createPredictionChallenges = (data) => {
  return axiosService.postWithToken(`${apiUrls.API_CREATE_PREDICTION_CHALLENGES}`, data);
};