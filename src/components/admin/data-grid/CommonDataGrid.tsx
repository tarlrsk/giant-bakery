import React from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { Box, alpha, Typography, ListItemText } from "@mui/material";

// ----------------------------------------------------------------------

export default function commonDataGrid() {
  const isActiveColumn = {
    field: "isActive",
    headerName: "การมองเห็น",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any>) => {
      let text;
      let bgColor;
      let textColor;
      if (params.value) {
        text = "แสดง";
        bgColor = alpha("#00AB55", 0.16);
        textColor = "#007B55";
      } else {
        text = "ซ่อน";
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
  };

  const statusColumn = {
    field: "status",
    headerName: "สถานะ",
    flex: 1,
    renderCell: (params: GridRenderCellParams<any>) => {
      let text;
      let bgColor;
      let textColor;
      switch (params.value) {
        case "IN_STOCK":
          text = "In Stock";
          textColor = "#007B55";
          bgColor = alpha("#00AB55", 0.16);
          break;
        case "OUT_OF_STOCK":
          text = "Out of Stock";
          textColor = "#B71D18";
          bgColor = alpha("#FF5630", 0.16);
          break;
        case "LOW":
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
  };

  const updatedAtColumn = {
    field: "updatedAt",
    headerName: "เปลี่ยนแปลงล่าสุด",
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
  };
  return { updatedAtColumn, statusColumn, isActiveColumn };
}
