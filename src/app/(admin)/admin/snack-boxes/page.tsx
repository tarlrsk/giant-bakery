"use client";

import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ISnackBoxRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import SnackBoxDataGrid from "@/components/admin/data-grid/SnackBoxDataGrid";
import EditProductCard from "@/components/admin/product-card/EditProductCard";
import NewSnackBoxCard from "@/components/admin/snack-box-card/NewSnackBoxCard";
import SnackBoxFilterToolbar from "@/components/admin/toolbars/SnackBoxFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminSnackBox() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = [
    {
      id: 1,
      snackBoxName: "World",
      status: "inStock",
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 2,
      snackBoxName: "is Awesome",
      status: "outStock",
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 3,
      snackBoxName: "is Amazing",
      status: "low",
      lastUpdated: "30/08/2023 ",
    },
  ];

  const [filteredRows, setFilteredRows] = useState(rows);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const isOnlyNewSnackBoxCardOpen = isAddCardOpen && !rowSelectionModel.length;

  const isOnlyEditProductCardOpen =
    rowSelectionModel.length > 0 && !isAddCardOpen;

  const isSnackBoxCardOpen = rowSelectionModel.length > 0 || isAddCardOpen;

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row: ISnackBoxRow) =>
          row.snackBoxName.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (status !== "all") {
      if (status === "active") {
        data = data.filter((row: ISnackBoxRow) => row.isActive);
      } else {
        data = data.filter((row: ISnackBoxRow) => !row.isActive);
      }
    }
    setFilteredRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  // useEffect(() => {
  //   console.log("rowSelectionModel", rowSelectionModel);
  // }, [rowSelectionModel]);

  const data = {
    productUpload: {
      path: "Screenshot 2567-02-12 at 13.59.45.jpeg",
      preview:
        "blob:http://localhost:3000/c50f6b97-d0ec-4e8d-921d-64cfd1b3da40",
    },
    productName: "ปูไทย",
    description: "อร่อยถูกใจเด็กไทยทุกคน",
    category: "bakery",
    subCategory: "bread",
    unitType: "",
    minQty: 5,
    price: 50,
    currentQty: 30,
    width: 20,
    length: 30,
    height: 25,
  };

  return (
    <Box>
      <SnackBoxFilterToolbar
        label="ชุดเบรก"
        methods={filterMethods}
        onClickNewSnackBox={() => {
          setRowSelectionModel([]);
          setIsAddCardOpen(true);
        }}
      />

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isSnackBoxCardOpen ? 8 : 12}>
          <SnackBoxDataGrid
            rows={filteredRows}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={(e) => {
              setRowSelectionModel(e);
              setIsAddCardOpen(false);
            }}
          />
        </Grid>
        {isOnlyNewSnackBoxCardOpen && (
          <Grid item xs={4}>
            <NewSnackBoxCard onClose={() => setIsAddCardOpen(false)} />
          </Grid>
        )}
        {isOnlyEditProductCardOpen && (
          <Grid item xs={4}>
            <EditProductCard
              data={data}
              isLoading={true}
              onClose={() => setRowSelectionModel([])}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
