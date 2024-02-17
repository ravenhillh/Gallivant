import React, { useEffect, useRef, PropsWithChildren } from 'react';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';

type Modal = {
  openModal: boolean;
  closeModal: () => void;
};

function Modal(
  props: PropsWithChildren<Modal> & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
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
      <Button
        variant='outlined'
        color='secondary'
        startIcon={<CancelIcon />}
        onClick={closeModal}
      >
        Cancel
      </Button>
    </dialog>
  );
}

export default Modal;
