"use client";

import useAdmin from "@/hooks/useAdmin";
import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ISnackBoxRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import SnackBoxDataGrid from "@/components/admin/data-grid/SnackBoxDataGrid";
import NewSnackBoxCard from "@/components/admin/snack-box-card/NewSnackBoxCard";
import EditSnackBoxCard from "@/components/admin/snack-box-card/EditSnackBoxCard";
import SnackBoxFilterToolbar from "@/components/admin/toolbars/SnackBoxFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminSnackBox() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  const {
    productsData: products,
    snackBoxData: snackBoxes,
    snackBoxIsLoading: isLoading,
  } = useAdmin().useSnackBoxAdmin();

  const productOptions = products?.data?.map(
    (product: { id: string; name: string }) => ({
      value: product.id,
      label: product.name,
    }),
  );

  const [filteredRows, setFilteredRows] = useState(snackBoxes?.data || []);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState<ISnackBoxRow | null>(null);

  const [selectedItems, setSelectedItems] = useState({});

  const isOnlyNewSnackBoxCardOpen = isAddCardOpen && !rowSelectionModel.length;

  const isOnlyEditProductCardOpen =
    rowSelectionModel.length > 0 && !isAddCardOpen;

  const isSnackBoxCardOpen = rowSelectionModel.length > 0 || isAddCardOpen;

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  useEffect(() => {
    let data = snackBoxes?.data || [];

    if (search) {
      data = data.filter(
        (row: ISnackBoxRow) =>
          row.name.toLowerCase().indexOf(search?.toLowerCase()) > -1,
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
  }, [search, snackBoxes?.data, status]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      const selectedRowData = snackBoxes?.data.find(
        (row: ISnackBoxRow) => row.id === rowSelectionModel[0],
      );

      const refreshmentObjects: {
        [key: string]: { value: string; label: string };
      } = {};
      selectedRowData.refreshments.forEach(
        (
          refreshment: { refreshment: { id: string; name: string } },
          index: any,
        ) => {
          const key = `item${index}`;
          refreshmentObjects[key] = {
            value: refreshment.refreshment.id,
            label: refreshment.refreshment.name,
          };
        },
      );

      setSelectedRow(selectedRowData || null);
      setSelectedItems(refreshmentObjects);
    }
  }, [rowSelectionModel, snackBoxes?.data]);

  // useEffect(() => {
  //   setFilteredRows(snackBoxes?.data || []);
  // }, [snackBoxes]);

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
            rows={filteredRows || []}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={(e) => {
              setRowSelectionModel(e);
              setIsAddCardOpen(false);
            }}
          />
        </Grid>
        {isOnlyNewSnackBoxCardOpen && (
          <Grid item xs={4}>
            <NewSnackBoxCard
              options={productOptions}
              onClose={() => setIsAddCardOpen(false)}
            />
          </Grid>
        )}
        {isOnlyEditProductCardOpen &&
          selectedRow &&
          rowSelectionModel[0] === selectedRow.id &&
          selectedItems && (
            <Grid item xs={4}>
              <EditSnackBoxCard
                data={selectedRow}
                selectedItems={selectedItems}
                option={productOptions}
                onClose={() => {
                  setRowSelectionModel([]);
                  setSelectedItems({});
                  setSelectedRow(null);
                }}
              />
            </Grid>
          )}
      </Grid>
    </Box>
  );
}
