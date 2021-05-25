import {createAction, createReducer, createSelector, on, props} from "@ngrx/store";
import {UserDevice} from "../model/UserDevice";
import {AppStore} from "../../app-store";

export interface DeviceListState {
  deviceList: Array<UserDevice>,
  selectedDevice: UserDevice | null;
}

export const initialState: DeviceListState = {
  deviceList: [],
  selectedDevice: null,
};

export const loadAccessedUserDevices = createAction(
  "[DeviceListState] Load Accessed User Devices"
);
export const loadAccessedUserDevicesSuccess = createAction(
  "[DeviceListState] Load Accessed User Devices Success",
  props<{ userDevices: Array<UserDevice>}>()
);

export const setSelectedUserDevice = createAction(
  "[DeviceListState] Set Selected User Device",
  props<{ userDevice: UserDevice }>()
);

export const deviceListReducer = createReducer<DeviceListState>(initialState,
  on(loadAccessedUserDevicesSuccess, ((state, action) => {
    return {...state, deviceList: action.userDevices};
  })),
  on(setSelectedUserDevice, (state, action) => {
    return {...state, selectedDevice: action.userDevice}
  })
);

export const selectDeviceListState = (state: AppStore) => {
  return state.deviceListState;
};

export const selectDeviceList = createSelector(
  selectDeviceListState,
  state => state.deviceList
);

export const selectSelectedDevice = createSelector(
  selectDeviceListState,
  state => state.selectedDevice
);

