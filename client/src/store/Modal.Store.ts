import _ from "lodash";
import { makeAutoObservable } from "mobx";

export interface ModalState {
  id: string;
  show: () => void;
  close: () => void;
  setTitle: (title: string) => void;
}

class ModalStore {
  constructor() {
    makeAutoObservable(this);
  }
  modals: ModalState[] = [];

  register(modal: ModalState) {
    this.modals.push(modal);
  }
  unregister(id: string) {
    _.remove(this.modals, (m) => m.id === id);
  }

  show(id: string) {
    const modal = this.modals.find((m) => m.id === id);
    if (modal) {
      modal.show();
    }
  }
  hide(id: string) {
    const modal = this.modals.find((m) => m.id === id);
    if (modal) {
      modal.close();
    }
  }
  hideAll() {
    this.modals.forEach((modal) => modal.close());
  }

  setTitle(id: string, title: string) {
    const modal = this.modals.find((m) => m.id === id);
    if (modal) {
      modal.setTitle(title);
    }
  }
}

export default ModalStore;
