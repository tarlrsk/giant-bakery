"use client";

import { Card } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
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
    { field: "name", headerName: "ชื่อชุดเบรก", flex: 1 },
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
