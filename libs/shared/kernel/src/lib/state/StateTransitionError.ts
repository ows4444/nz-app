export class StateTransitionError<S extends number> extends Error {
  constructor(currentState: S, attemptedState: S) {
    super(`Invalid state transition from ${currentState} to ${attemptedState}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
