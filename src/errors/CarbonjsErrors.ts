"use strict";

export default class CarbonjsError extends Error {
  constructor(message: string) {
    super(message);
    Error.captureStackTrace?.(this, CarbonjsError);
  }

  override get name() {
    return "Carbonjs";
  }
}
