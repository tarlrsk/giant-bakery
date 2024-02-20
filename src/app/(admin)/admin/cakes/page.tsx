"use client";

import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ICakeRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import NewCakeCard from "@/components/admin/cake-card/NewCakeCard";
import EditCakeCard from "@/components/admin/cake-card/EditCakeCard";
import CakeDataGrid from "@/components/admin/data-grid/CakeDataGrid";
import CakeFilterToolbar from "@/components/admin/toolbars/CakeFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminCake() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = [
    {
      id: 1,
      cakeType: "Preset",
      cakeName: "World",
      isActive: true,
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 2,
      cakeType: "Preset",
      cakeName: "is Awesome",
      isActive: false,
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 3,
      cakeType: "Custom",
      cakeName: "is Amazing",
      isActive: true,
      lastUpdated: "30/08/2023 ",
    },
  ];

  const [filteredRows, setFilteredRows] = useState(rows);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const isOnlyNewCakeCardOpen = isAddCardOpen && !rowSelectionModel.length;

  const isOnlyEditCakeCardOpen = rowSelectionModel.length > 0 && !isAddCardOpen;

  const isCakeCardOpen = rowSelectionModel.length > 0 || isAddCardOpen;

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row: ICakeRow) =>
          row.cakeName &&
          row.cakeName.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (status !== "all") {
      if (status === "active") {
        data = data.filter((row: ICakeRow) => row.isActive);
      } else {
        data = data.filter((row: ICakeRow) => !row.isActive);
      }
    }
    setFilteredRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  // useEffect(() => {
  //   console.log("rowSelectionModel", rowSelectionModel);
  // }, [rowSelectionModel]);

  const presetCake = {
    cakeUpload: {
      path: "Screenshot 2567-02-12 at 13.59.45.jpeg",
      preview:
        "blob:http://localhost:3000/c50f6b97-d0ec-4e8d-921d-64cfd1b3da40",
    },
    isActive: true,
    cakeName: "เค้กไทย",
    description: "อร่อยถูกใจเด็กไทยทุกคน",
    cakeType: "custom",
    price: 50,
    width: 20,
    length: 30,
    height: 25,
    weight: 20,
    cream: ["strawberry"],
    topEdge: ["chocolate"],
    bottomEdge: ["strawberry"],
    decoration: ["strawberry"],
    surface: ["strawberry"],
  };

  return (
    <Box>
      <CakeFilterToolbar
        label="เค้ก"
        methods={filterMethods}
        onClickNewCake={() => {
          setRowSelectionModel([]);
          setIsAddCardOpen(true);
        }}
      />

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isCakeCardOpen ? 8 : 12}>
          <CakeDataGrid
            rows={filteredRows}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={(e) => {
              setRowSelectionModel(e);
              setIsAddCardOpen(false);
            }}
          />
        </Grid>
        {isOnlyNewCakeCardOpen && (
          <Grid item xs={4}>
            <NewCakeCard onClose={() => setIsAddCardOpen(false)} />
          </Grid>
        )}
        {isOnlyEditCakeCardOpen && (
          <Grid item xs={4}>
            <EditCakeCard
              data={presetCake}
              isLoading={true}
              onClose={() => setRowSelectionModel([])}
            />
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
