"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, alpha, Typography, ListItemText } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { ICakeRow } from "../types";
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
  const columns: GridColDef[] = [
    {
      field: "cakeType",
      headerName: "ชนิดเค้ก",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
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
              {params.value}
            </Typography>
          </>
        );
      },
    },
    { field: "cakeName", headerName: "ชื่อเค้ก", flex: 1 },
    {
      field: "isActive",
      headerName: "สถานะ",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        let bgColor;
        let textColor;
        if (params.value) {
          text = "Active";
          bgColor = alpha("#00AB55", 0.16);
          textColor = "#007B55";
        } else {
          text = "Inactive";
          textColor = "#B71D18";
          bgColor = alpha("#FF5630", 0.16);
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
      field: "lastUpdated",
      headerName: "เปลี่ยนแปลงล่าสุด",
      flex: 1,
      renderCell: (params) => (
        <ListItemText
          primary={<Typography variant="body2">30/08/2023</Typography>}
          secondary={
            <>
              <Typography
                sx={{ display: "inline" }}
                component="span"
                variant="caption"
              >
                02:30 น.
              </Typography>
            </>
          }
        />
      ),
    },
  ];

  return (
    <Card sx={{ boxShadow: 0 }}>
      <div style={{ height: 660 }}>
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
          // hideFooter
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
