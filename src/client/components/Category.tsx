import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, SelectChangeEvent } from '../utils/material';

const Category = () => {
  const { name } = useParams();
  const [category, setCategory] = useState<string>('');

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCatChange = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

  return (
    <div>
      <h3>Category: { name }</h3>
      <Button onClick={handleOpen}>Open modal</Button>
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <Box
            height={200}
            width={200}
            my={4}
            display="flex"
            alignItems="center"
            gap={4}
            p={2}
            sx={{ border: '2px solid grey', bgcolor: 'white' }}
          >
          <FormControl fullWidth>
           <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={handleCatChange}
            >
              <MenuItem value={'entertainment'}>Entertainment</MenuItem>
              <MenuItem value={'food&drink'}>Food & Drink</MenuItem>
              <MenuItem value={'nightlife'}>Nightlife</MenuItem>
            </Select>
         </FormControl>
         </Box>
        </div>
      </Modal>
      
    </div>
  );
};

export default Category;