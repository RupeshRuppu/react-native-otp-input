import {ReducerAction, ReducerState} from '../types';

function reducer(currState: ReducerState, action: ReducerAction) {
  const copiedState = [...currState];
  const {type, payload} = action;

  const object = copiedState.find(elem => elem.active);

  if (object) {
    if (type === 'FORWARD') {
      object.value = payload.value;
      object.active = false;
      const nextIndex =
        payload.idx === copiedState.length - 1 ? payload.idx : payload.idx + 1;
      copiedState[nextIndex].active = true;
    }

    if (type === 'BACKWARD') {
      const curr = object.value ? true : false;
      object.value = payload.value;

      if (curr) {
        object.active = true;
      } else {
        object.active = false;
        const prevIndex = object.idx === 0 ? 0 : payload.idx - 1;
        copiedState[prevIndex].active = true;
        copiedState[prevIndex].value = '';
      }
    }

    if (type === 'RESET') {
      copiedState.forEach((object, index) => {
        object.value = '';
        object.active = index === 0 ? true : false;
      });
    }
  }

  return copiedState;
}

export default reducer;
