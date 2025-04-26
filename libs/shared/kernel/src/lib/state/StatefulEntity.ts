import { StateTransitionError } from './StateTransitionError';

export abstract class StatefulEntity<S extends number> {
  private _state: S;
  private validator: (current: S, next: S) => boolean;

  constructor(initialState: S, validator: (current: S, next: S) => boolean) {
    this._state = initialState;
    this.validator = validator;
  }

  protected getState(): S {
    return this._state;
  }

  protected transitionState(newState: S): void {
    if (!this.validator(this._state, newState)) {
      throw new StateTransitionError(this._state, newState);
    }
    this._state = newState; // Update state directly
  }
}
