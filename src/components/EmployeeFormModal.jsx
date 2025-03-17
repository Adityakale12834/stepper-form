import { Backdrop, Box, Button, Fade, Modal, Typography } from '@mui/material';
import React from 'react'
import EmployeeStepper from './EmployeeStepper';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "60vw",
    bgcolor: 'background.paper',
  //   border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
function EmployeeFormModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    return (
      <div>
        <Button onClick={handleOpen} variant='contained'>See Details</Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <EmployeeStepper/>
            </Box>
          </Fade>
        </Modal>
      </div>
    );
}

export default EmployeeFormModal