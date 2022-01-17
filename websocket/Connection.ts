export type onMessageFunction = (
  event: MessageEvent,
  connection: Connection,
) => void;
export type onCloseFunction = (
  event: CloseEvent,
  connection: Connection,
) => void;

export class Connection {
  private websocket: WebSocket;
  private uuid = crypto.randomUUID();
  private type = "";
  private onMessage: onMessageFunction;

  constructor(
    websocket: WebSocket,
    onMessage: onMessageFunction,
    onClose: onCloseFunction,
  ) {
    this.websocket = websocket;
    this.onMessage = onMessage;

    websocket.addEventListener("message", this.onAuthentication.bind(this));
    websocket.addEventListener("close", (ev: CloseEvent) => onClose(ev, this));
    console.log(
      `Waiting for authentication websocket connection: ${this.getUuid()}`,
    );
  }

  /* First message is used for authentication */
  private onAuthentication(message: MessageEvent<string>) {
    const authenticationObject: Record<string, never> = JSON.parse(
      message.data,
    );

    if (typeof authenticationObject.token === "string") {
      if (authenticationObject.token === "hardcoded-valid") {
        if (authenticationObject.username === "mary" && 
          authenticationObject.password === "WelkomThuis") {
          this.type = "resident";
          this.websocket.addEventListener(
            "message",
            (event) => this.onMessage(event, this),
          );
          this.websocket.send("{ \"role\": \""+this.type+"\"}");
          console.log(`Socket ${this.getUuid()} has authenticated as resident.`);
        } else if (authenticationObject.username === "bob" && 
          authenticationObject.password === "SesamOpenU") {
          this.type = "guard";
          this.websocket.addEventListener(
            "message",
            (event) => this.onMessage(event, this),
          );
          this.websocket.send("{ \"role\": \""+this.type+"\"}");
          console.log(`Socket ${this.getUuid()} has authenticated as guard.`);
       }
      }
    }
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getSocket(): WebSocket {
    return this.websocket;
  }

  public getType(): string {
    return this.type;
  }
}
