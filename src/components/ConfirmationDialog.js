import React from 'react';
import { Dialog, DialogActions, DialogContent, Button, Typography } from '@mui/material';

const ConfirmationDialog = ({ open, onClose, onConfirm, message }) => {
  return (
    <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: '400px' } }}>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Отмена</Button>
        <Button onClick={onConfirm} color="error">Подтвердить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
