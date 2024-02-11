import React, { useEffect, useRef, PropsWithChildren } from 'react';

type Modal = {
  openModal: boolean;
  closeModal: () => void;
};

function Modal(props: PropsWithChildren<Modal> & React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  const { openModal, closeModal, children } = props;
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (openModal) {
      dialog.current?.showModal();
    } else {
      dialog.current?.close();
    }
  }, [openModal]);

  return (
    <dialog ref={dialog} onCancel={closeModal}>
      {children}
      <button onClick={closeModal}>Cancel</button>
    </dialog>
  );
}

export default Modal;
