"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, Typography } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { ICakeRow } from "../types";
import commonDataGrid from "./CommonDataGrid";
import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";

// ----------------------------------------------------------------------

type Props = {
  rows: ICakeRow[];
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
};

// ----------------------------------------------------------------------

export default function CakeDataGrid({
  rows,
  rowSelectionModel,
  setRowSelectionModel,
}: Props) {
  const { isActiveColumn, updatedAtColumn } = commonDataGrid();
  const columns: GridColDef[] = [
    {
      field: "type",
      headerName: "ชนิดเค้ก",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        switch (params.value) {
          case "PRESET":
            text = "สำเร็จรูป";
            break;
          case "CUSTOM":
            text = "กำหนดเอง";
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
    { field: "name", headerName: "ชื่อเค้ก", flex: 1 },
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
          initialState={{
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
