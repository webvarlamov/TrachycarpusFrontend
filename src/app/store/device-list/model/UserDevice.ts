export interface UserDeviceModel {
  id: string;
  uuid: string;
  name: string;
  userAgent: string;
  active: string;
  holder: string;
}

export class UserDevice implements UserDeviceModel {
  public id: string;
  public active: string;
  public holder: string;
  public name: string;
  public userAgent: string;
  public uuid: string;

  constructor(params: UserDeviceModel) {
    this.id = params?.id
    this.active = params?.active;
    this.holder = params?.holder;
    this.name = params?.name;
    this.userAgent = params?.userAgent;
    this.uuid = params?.uuid;
  }
}
