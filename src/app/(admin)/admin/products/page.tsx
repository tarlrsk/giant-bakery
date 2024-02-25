"use client";

import { z } from "zod";
import useAdmin from "@/hooks/useAdmin";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { IProductRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { refreshmentValidationSchema } from "@/lib/validationSchema";
import { Box, Grid, Backdrop, CircularProgress } from "@mui/material";
import ProductDataGrid from "@/components/admin/data-grid/ProductDataGrid";
import NewProductCard from "@/components/admin/product-card/NewProductCard";
import EditProductCard from "@/components/admin/product-card/EditProductCard";
import ProductFilterToolbar from "@/components/admin/toolbars/ProductFilterToolbar";

// ----------------------------------------------------------------------

type RefreshmentProps = z.infer<typeof refreshmentValidationSchema>;

// ----------------------------------------------------------------------

export default function AdminRefreshment() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [selectedRow, setSelectedRow] = useState<RefreshmentProps | null>(null);

  const { productsData: products, productsIsLoading: isLoading } = useAdmin();

  const [filteredRows, setFilteredRows] = useState(products?.data || []);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  const isOnlyNewProductCardOpen = isAddCardOpen && !rowSelectionModel.length;

  const isOnlyEditProductCardOpen =
    rowSelectionModel.length > 0 && !isAddCardOpen;

  const isProductCardOpen = rowSelectionModel.length > 0 || isAddCardOpen;

  useEffect(() => {
    let data = products?.data;

    if (search) {
      data = data.filter(
        (row: IProductRow) =>
          row.name.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (status !== "all") {
      data = data.filter((row: IProductRow) => row.status === status);
    }
    setFilteredRows(data);
  }, [products, search, status]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      const selectedRowData = products?.data.find(
        (row: IProductRow) => row.id === rowSelectionModel[0],
      );
      setSelectedRow(selectedRowData || null);
    }
  }, [products, rowSelectionModel]);

  useEffect(() => {
    setFilteredRows(products?.data || []);
  }, [products]);

  return (
    <Box>
      <ProductFilterToolbar
        label="สินค้า"
        methods={filterMethods}
        onClickNewProduct={() => {
          setRowSelectionModel([]);
          setIsAddCardOpen(true);
        }}
      />

      <Grid container direction="row" spacing={2}>
        <Grid item xs={isProductCardOpen ? 8 : 12}>
          <ProductDataGrid
            rows={filteredRows}
            rowSelectionModel={rowSelectionModel}
            setRowSelectionModel={(e) => {
              setRowSelectionModel(e);
              setIsAddCardOpen(false);
            }}
          />
        </Grid>
        {isOnlyNewProductCardOpen && (
          <Grid item xs={4}>
            <NewProductCard onClose={() => setIsAddCardOpen(false)} />
          </Grid>
        )}
        {isOnlyEditProductCardOpen &&
          selectedRow &&
          rowSelectionModel[0] === selectedRow.id && (
            <Grid item xs={4}>
              <EditProductCard
                data={selectedRow}
                isLoading={false}
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
