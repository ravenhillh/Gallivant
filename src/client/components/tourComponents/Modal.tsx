import React, { PropsWithChildren } from 'react';

import { Box, Button, CancelIcon, Modal } from '../../utils/material';

type CustomModal = {
  openModal: boolean;
  closeModal: () => void;
};

const style = {
  position: 'relative',
  my: '4',
  width: '88%',
  maxWidth: '500px',
  height: 'fit-content',
  top: '10%',
  gap: '4',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  pt: 3,
  px: 5,
  pb: 3,
};

const containerStyle = {
  display: 'flex',
  alignItems: '10%',
  justifyContent: 'center',
};

function CustomModal(
  props: PropsWithChildren<CustomModal> & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const { openModal, closeModal, children } = props;

  return (
    <Modal sx={containerStyle} open={openModal} onClose={closeModal}>
      <Box sx={style}>
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
