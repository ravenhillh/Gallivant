import React, { PropsWithChildren } from 'react';

import { Box, Button, CancelIcon, Modal } from '../../utils/material';

type CustomModal = {
  openModal: boolean;
  closeModal: () => void;
};

const style = {
  position: 'sticky',
  my: '4',
  width: '80%',
  alignItems: 'center',
  top: '10%',
  left: '10%',
  gap: '4',
  p: '2',
  // transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '3px solid #222',
  borderRadius: 2,
  boxShadow: 24,
  pt: 3,
  px: 5,
  pb: 3,
};

function CustomModal(
  props: PropsWithChildren<CustomModal> & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const { openModal, closeModal, children } = props;

  return (
    <Modal className="custom-modal" disableScrollLock={true} open={openModal} onClose={closeModal}>
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
