class GuiderError extends Error {
  public statusCode = 500;
}

export class WebsocketUpgradeError extends GuiderError {
  message = "Request could not be upgraded to a websocket";
  statusCode = 400;
}
