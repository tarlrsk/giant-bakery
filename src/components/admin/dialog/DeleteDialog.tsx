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
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

// ----------------------------------------------------------------------

export default function DeleteDialog({
  open,
  name,
  isLoading,
  onClose,
  onDelete,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{`ต้องการลบ${name}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {`เมื่อลบ ${name} แล้วจะไม่สามารถกู้ข้อมูลกลับมาได้ ต้องการที่จะลบหรือไม่`}
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
          onClick={onDelete}
          loading={isLoading}
        >
          ยืนยัน
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
