import React, { PropsWithChildren, ReactNode } from 'react';

import { Box, Button, CancelIcon, Modal } from '../../utils/material';

type CustomModal = {
  openModal: boolean;
  closeModal: () => void;
  confirmButton?: ReactNode;
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
  // maxHeight: '95vh',
  // overflow: 'auto',
};

const containerStyle = {
  display: 'flex',
  alignItems: '10%',
  justifyContent: 'center',
  overflow: 'auto',
};

function CustomModal(
  props: PropsWithChildren<CustomModal> & React.HTMLAttributes<HTMLDivElement>
): JSX.Element {
  const { openModal, closeModal, children, confirmButton } = props;

  return (
    <Modal
      className='custom-modal'
      disableScrollLock={true}
      sx={containerStyle}
      open={openModal}
      onClose={closeModal}
    >
      <Box sx={style}>
        {children}
        <div className='modal-button-row'>
          <Button
            variant='outlined'
            size='small'
            color='secondary'
            startIcon={<CancelIcon />}
            onClick={closeModal}
          >
            Cancel
          </Button>
          {confirmButton}
        </div>
      </Box>
    </Modal>
  );
}

export default CustomModal;
