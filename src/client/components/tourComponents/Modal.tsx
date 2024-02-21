import React, { useEffect, useRef, PropsWithChildren } from 'react';

import { Button, CancelIcon } from '../../utils/material';

type CustomModal = {
  openModal: boolean;
  closeModal: () => void;
};

function CustomModal(
  props: PropsWithChildren<CustomModal> & React.HTMLAttributes<HTMLDivElement>
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
        size='small'
        color='secondary'
        startIcon={<CancelIcon />}
        onClick={closeModal}
      >
        Cancel
      </Button>
    </dialog>
  );
}

export default CustomModal;
