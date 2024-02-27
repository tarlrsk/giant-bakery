import React from "react";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onCancel: () => void;
};

// ----------------------------------------------------------------------

export default function CancelOrderDialog({
  open,
  isLoading,
  onClose,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{`ต้องการยกเลิกออเดอร์?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`เมื่อลบออเดอร์แล้วจะไม่สามารถย้อนกลับได้ ต้องการที่จะลบออเดอร์หรือไม่`}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          size="large"
          variant="outlined"
          color="inherit"
          onClick={onClose}
        >
          ยกเลิก
        </Button>
        <LoadingButton
          size="large"
          variant="contained"
          color="error"
          onClick={onCancel}
          loading={isLoading}
        >
          ยืนยัน
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
