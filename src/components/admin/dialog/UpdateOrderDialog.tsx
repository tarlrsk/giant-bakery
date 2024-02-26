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
  text: string;
  open: boolean;
  isLoading: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

// ----------------------------------------------------------------------

export default function UpdateOrderDialog({
  text,
  open,
  isLoading,
  onClose,
  onUpdate,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{`ต้องการ${text}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          เมื่อยืนยันสถานะของออเดอร์แล้ว
          สถานะของออเดอร์จะถูกเปลี่ยนเป็นสถานะถัดไปและจะแสดงสถานะออเดอร์ใหม่ให้ลูกค้าเห็น
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
          color="secondary"
          onClick={onUpdate}
          loading={isLoading}
        >
          ยืนยัน
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
