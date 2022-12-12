import { configureStore } from "@reduxjs/toolkit";
import QuestionReducer from "./slices/QuestionSlice";
import ResponseReducer from "./slices/QuestionResponseSlice";
import SurveyReducer from "./slices/ServeySlice";
import BtnSpinerReducer from "./slices/ButtonSpinerSlice";
import UserReducer from "./slices/UserSlice";
import IsLoadingReducer from './spinerSlice'

const store = configureStore({
  reducer: {
    question: QuestionReducer,
    response: ResponseReducer,
    survey: SurveyReducer,
    btn: BtnSpinerReducer,
    user:UserReducer,
    loading:IsLoadingReducer,

  },
});
export default store;
