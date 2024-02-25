"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridRowSelectionModel } from "@mui/x-data-grid";

import { ISnackBoxRow } from "../types";
import commonDataGrid from "./CommonDataGrid";
import { CustomNoRowsOverlay } from "./CustomNoRowsOverlay";

// ----------------------------------------------------------------------

type Props = {
  rows: ISnackBoxRow[];
  rowSelectionModel: GridRowSelectionModel;
  setRowSelectionModel: Dispatch<SetStateAction<GridRowSelectionModel>>;
};

// ----------------------------------------------------------------------

export default function SnackBoxDataGrid({
  rows,
  rowSelectionModel,
  setRowSelectionModel,
}: Props) {
  const { isActiveColumn, updatedAtColumn } = commonDataGrid();
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "ชื่อชุดเบรก",
      flex: 1,
      renderCell: (params) => (
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
            {params.value}
          </Typography>
        </>
      ),
    },
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
            pagination: { paginationModel: { pageSize: 50 } },
          }}
          pageSizeOptions={[50, 100, 150]}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
          }}
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
