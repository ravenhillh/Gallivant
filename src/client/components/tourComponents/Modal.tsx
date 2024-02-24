import React, { PropsWithChildren } from 'react';

import { Button, Modal, Box, CancelIcon } from '../../utils/material';

type CustomModal = {
  openModal: boolean;
  closeModal: () => void;
};

const style = {
  position: 'absolute',
  my: '4',
  width: '75%',
  alignItems: 'center',
  top: '25%',
  left: '50%',
  gap: '4',
  p: '2',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

function CustomModal(
  props: PropsWithChildren<CustomModal> & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const { openModal, closeModal, children } = props;

  return (
    <Modal open={openModal} onClose={closeModal}>
      <Box sx={{ ...style }}>
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
      </Box>
    </Modal>
  );
}

export default CustomModal;
