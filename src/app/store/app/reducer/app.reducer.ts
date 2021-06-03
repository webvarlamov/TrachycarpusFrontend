import {createAction, createReducer, createSelector, on, props} from "@ngrx/store";
import { AppStore } from "../../app-store";

export interface AppState {
  showVideoCallComponent: boolean;
}

export const initialState: AppState = {
  showVideoCallComponent: false
};

export const toggleShowVideoCallComponent = createAction(
  "[AppState] Toggle Show Video Call Component", props<{show: boolean}>()
);

export const appReducer = createReducer<AppState>(initialState,
  on(toggleShowVideoCallComponent, ((state, action) => {
    return {...state, showVideoCallComponent: action.show}
  }))
);

export const selectAppState = (state: AppStore) => {
  return state.appState;
};

export const selectShowVideoCallComponent= createSelector(
  selectAppState,
  state => state.showVideoCallComponent
);

