"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import commonDataGrid from "./CommonDataGrid";
import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";

// ----------------------------------------------------------------------

type Props = {
  rows: any;
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
};

// ----------------------------------------------------------------------

export default function VariantDataGrid({
  rows,
  rowSelectionModel,
  setRowSelectionModel,
}: Props) {
  const { isActiveColumn, updatedAtColumn } = commonDataGrid();
  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "ประเภทตัวเลือก",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        switch (params.row.variantType) {
          case "cream":
            text = "ครีม";
            break;
          case "topBorder":
            text = "ขอบบน";
            break;
          case "bottomBorder":
            text = "ขอบล่าง";
          case "decoration":
            text = "ลายรอบเค้ก";
          case "surface":
            text = "หน้าเค้ก";
        }

        return (
          <>
            <Box
              width={6}
              height={52}
              sx={{
                backgroundColor: "secondary.main",
                position: "absolute",
                left: 0,
                visibility:
                  params.id === rowSelectionModel[0] ? "visible" : "hidden",
              }}
            />
            <Typography variant="body2" fontFamily="IBM Plex Sans Thai" ml={1}>
              {text}
            </Typography>
          </>
        );
      },
    },
    { field: "name", headerName: "ชื่อตัวเลือก", flex: 1 },
    isActiveColumn,
    updatedAtColumn,
  ];

  return (
    <Card sx={{ boxShadow: 0 }}>
      <div style={{ height: 780 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          columnHeaderHeight={45}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
