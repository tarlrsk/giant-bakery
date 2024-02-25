"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { IProductRow } from "../types";
import commonDataGrid from "./CommonDataGrid";
import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";

// ----------------------------------------------------------------------

type Props = {
  rows: IProductRow[];
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
};

// ----------------------------------------------------------------------

export default function ProductDataGrid({
  rows,
  rowSelectionModel,
  setRowSelectionModel,
}: Props) {
  const { updatedAtColumn, statusColumn } = commonDataGrid();
  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "หมวดหมู่",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        switch (params.value) {
          case "BAKERY":
            text = "เบเกอรี่";
            break;
          case "BEVERAGE":
            text = "เครื่องดื่ม";
            break;
          default:
            text = "";
            break;
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
    {
      field: "category",
      headerName: "หมวดหมู่ย่อย",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;

        switch (params.value) {
          case "BREAD":
            text = "ขนมปัง";
            break;
          case "SNACK":
            text = "ขนม";
            break;
          case "PIE":
            text = "พาย";
            break;
          case "COOKIE":
            text = "คุกกี้";
            break;
          case "CAKE":
            text = "เค้ก";
            break;
          default:
            text = "-";
            break;
        }
        return (
          <>
            <Box width={6} height={52} />
            <Typography variant="body2" fontFamily="IBM Plex Sans Thai">
              {text}
            </Typography>
          </>
        );
      },
    },
    { field: "name", headerName: "ชื่อสินค้า", flex: 1 },
    statusColumn,
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
          initialState={{
            sorting: {
              sortModel: [{ field: "type", sort: "asc" }],
            },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 20, 30]}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
