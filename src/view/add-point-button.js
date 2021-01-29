import AbstractView from '../view/abstract.js';

const createAddPointButton = () => {
  return `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>`;
};

export default class AddPointButton extends AbstractView {
  constructor() {
    super();
  }
  getTemplate() {
    return createAddPointButton();
  }
}
