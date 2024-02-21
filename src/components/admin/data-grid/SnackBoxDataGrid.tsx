"use client";

import { Dispatch, SetStateAction } from "react";
import { Box, Card, alpha, Typography, ListItemText } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowSelectionModel,
} from "@mui/x-data-grid";

import { ISnackBoxRow } from "../types";

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
  const columns: GridColDef[] = [
    {
      field: "snackBoxName",
      headerName: "ชื่อชุดเบรก",
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
    {
      field: "status",
      headerName: "สถานะ",
      flex: 1,
      renderCell: (params: GridRenderCellParams<any>) => {
        let text;
        let bgColor;
        let textColor;
        switch (params.value) {
          case "inStock":
            text = "In Stock";
            textColor = "#007B55";
            bgColor = alpha("#00AB55", 0.16);
            break;
          case "outStock":
            text = "Out of Stock";
            textColor = "#B71D18";
            bgColor = alpha("#FF5630", 0.16);
            break;
          case "low":
            text = "Low";
            textColor = "#B76E00";
            bgColor = alpha("#FFAB00", 0.16);

            break;
          default:
            text = "None";
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
      <div>
        <DataGrid
          rows={rows}
          columns={columns}
          disableColumnMenu
          onRowSelectionModelChange={(newRowSelectionModel) => {
            setRowSelectionModel(newRowSelectionModel);
          }}
          rowSelectionModel={rowSelectionModel}
          columnHeaderHeight={45}
          // hideFooter
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
        />
      </div>
    </Card>
  );
}
