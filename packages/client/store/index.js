import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { encryptTransform } from "redux-persist-transform-encrypt";
import authReducer from "./slices/auth";
import foodEntriesReducer from "./slices/foodEntries";
import mealsReducer from "./slices/meals";
import calorieLimitsReducer from "./slices/calorieLimits";
import usersReducer from "./slices/users";
import averageCaloriesReducer from "./slices/averageCalories";

const reducers = combineReducers({
  auth: authReducer,
  foodEntries: foodEntriesReducer,
  meals: mealsReducer,
  calorieLimits: calorieLimitsReducer,
  users: usersReducer,
  averageCalories: averageCaloriesReducer
});

const persistConfig = {
  key: "root",
  storage: storageSession,
  transforms: [
    encryptTransform({
      secretKey: process.env.NEXT_PUBLIC_SECRET_KEY,
      onError: function (error) {
        console.log(error);
      }
    })
  ]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
