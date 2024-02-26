"use client";

import { Box, Card, alpha, Typography, ListItemText } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
} from "@mui/x-data-grid";

import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";

// ----------------------------------------------------------------------

type Props = {
  rows: any[];
  onRowClick: GridEventListener<"rowClick">;
};

// ----------------------------------------------------------------------

export default function OrderDataGrid({ rows, onRowClick }: Props) {
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "หมายเลขออเดอร์",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        return (
          <Typography
            variant="body2"
            fontFamily="IBM Plex Sans Thai"
          ></Typography>
        );
      },
    },
    { field: "customer", headerName: "ลูกค้า", flex: 1 },
    {
      field: "paymentType",
      headerName: "ประเภทการชำระ",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        let bgColor;
        let textColor;
        switch (params.value) {
          case "SINGLE":
            text = "จ่ายเต็ม";
            bgColor = alpha("#00AB55", 0.16);
            textColor = "#007B55";
            break;
          case "INSTALLMENT":
            text = "มัดจำ";
            textColor = "#B76E00";
            bgColor = alpha("#FFAB00", 0.16);
            break;
          default:
            text = "ไม่มีข้อมูล";
            textColor = "#212B36";
            bgColor = alpha("#919EAB", 0.16);
        }

        return (
          <Box sx={{ bgcolor: bgColor, borderRadius: 1.6, px: 1.25, py: 0.5 }}>
            <Typography
              variant="caption"
              fontFamily="IBM Plex Sans Thai"
              fontWeight={600}
              color={textColor}
            >
              {text}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "orderDate",
      headerName: "วันที่สั่งออเดอร์",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        const date = new Date(params.value);
        const displayDate = date.toLocaleDateString("en-GB");
        const hour = date.getHours();
        const minute = date.getMinutes();
        if (!params.value) return "-";
        return (
          <ListItemText
            primary={<Typography variant="body2">{displayDate}</Typography>}
            secondary={
              <>
                <Typography
                  sx={{ display: "inline" }}
                  component="span"
                  variant="caption"
                >
                  {`${hour}:${minute} น.`}
                </Typography>
              </>
            }
          />
        );
      },
    },
    {
      field: "orderStatus",
      headerName: "สถานะออเดอร์",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        let bgColor;
        let textColor;
        switch (params.value) {
          case "COMPLETED":
            text = "เสร็จสิ้น";
            textColor = "#007B55";
            bgColor = alpha("#00AB55", 0.16);
            break;
          case "CANCELLED":
            text = "ยกเลิก";
            textColor = "#B71D18";
            bgColor = alpha("#FF5630", 0.16);
            break;
          case "PENDING_PAYMENT2":
            text = "รอชำระเงิน";
            textColor = "#B76E00";
            bgColor = alpha("#FFAB00", 0.16);
            break;
          case "PENDING_ORDER":
            text = "รอยืนยันออเดอร์";
            textColor = "#212B36";
            bgColor = alpha("#919EAB", 0.16);
            break;
          case "ON_PROCESS":
            text = "กำลังเตรียมออเดอร์";
            textColor = "#0288d1";
            bgColor = alpha("#29b6f6", 0.16);
            break;
          default:
            text = "ไม่มีข้อมูล";
            textColor = "#212B36";
            bgColor = alpha("#919EAB", 0.16);
        }
        return (
          <Box sx={{ bgcolor: bgColor, borderRadius: 1.6, px: 1.25, py: 0.5 }}>
            <Typography
              variant="caption"
              fontFamily="IBM Plex Sans Thai"
              fontWeight={600}
              color={textColor}
            >
              {text}
            </Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <Card sx={{ boxShadow: 0 }}>
      <div style={{ height: 780 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          columnHeaderHeight={45}
          onRowClick={onRowClick}
          initialState={{
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          pageSizeOptions={[50, 100, 150]}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          // hideFooter
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
