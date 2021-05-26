export class HttpUtils {

  constructor() { }

  public static isHttps(): boolean {
    return document.location.protocol === "https";
  }

  public static getHost(): string {
    return location.host
  }

  public static getHostName(): string {
    return location.hostname
  }

  public static isDev(): boolean {
    return location.port === "4200" || location.port === "4201"
  }
}
