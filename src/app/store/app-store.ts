import {DeviceListState} from "./device-list/reducer/device-list.reducer";
import {AppState} from "./app/reducer/app.reducer";

export interface AppStore {
  deviceListState: DeviceListState;
  appState: AppState
}
