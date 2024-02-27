import React, { Dispatch } from "react";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  Button,
  TextField,
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
  isTrackingRequired: boolean;
  setTrackingNo: Dispatch<string>;
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
  setTrackingNo,
  isTrackingRequired,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle id="alert-dialog-title">{`ต้องการ${text}?`}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          เมื่อยืนยันสถานะของออเดอร์แล้ว
          สถานะของออเดอร์จะถูกเปลี่ยนเป็นสถานะถัดไปและจะแสดงสถานะออเดอร์ใหม่ให้ลูกค้าเห็น
        </DialogContentText>

        {isTrackingRequired && (
          <TextField
            fullWidth
            size="small"
            onChange={(e) => setTrackingNo(e.target.value)}
            label="Tracking Number"
            sx={{ mt: 2 }}
            required
          />
        )}
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
