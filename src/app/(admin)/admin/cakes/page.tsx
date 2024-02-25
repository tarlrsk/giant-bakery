"use client";

import useAdmin from "@/hooks/useAdmin";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ICakeRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import NewCakeCard from "@/components/admin/cake-card/NewCakeCard";
import EditCakeCard from "@/components/admin/cake-card/EditCakeCard";
import CakeDataGrid from "@/components/admin/data-grid/CakeDataGrid";
import { Box, Grid, Backdrop, CircularProgress } from "@mui/material";
import CakeFilterToolbar from "@/components/admin/toolbars/CakeFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminCake() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  const [selectedRow, setSelectedRow] = useState<ICakeRow | null>(null);

  const { cakesData: cakes, cakesIsLoading: isLoading } = useAdmin();

  const [filteredRows, setFilteredRows] = useState(cakes?.data || []);

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
    let data = cakes?.data || [];

    if (search) {
      data = data.filter(
        (row: ICakeRow) =>
          row.name.toLowerCase().indexOf(search?.toLowerCase()) > -1,
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
  }, [cakes, search, status]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      const selectedRowData = cakes?.data.find(
        (row: ICakeRow) => row.id === rowSelectionModel[0],
      );
      setSelectedRow(selectedRowData || null);
    }
  }, [cakes, rowSelectionModel]);

  useEffect(() => {
    setFilteredRows(cakes?.data || []);
  }, [cakes]);

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
        {isOnlyEditCakeCardOpen &&
          selectedRow &&
          rowSelectionModel[0] === selectedRow.id && (
            <Grid item xs={4}>
              <EditCakeCard
                data={selectedRow}
                onClose={() => {
                  setRowSelectionModel([]);
                  setSelectedRow(null);
                }}
              />
            </Grid>
          )}
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
    </Box>
  );
}
