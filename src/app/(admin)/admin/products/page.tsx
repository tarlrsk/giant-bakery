"use client";

import { Box, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { IProductRow } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import ProductDataGrid from "@/components/admin/data-grid/ProductDataGrid";
import NewProductCard from "@/components/admin/product-card/NewProductCard";
import EditProductCard from "@/components/admin/product-card/EditProductCard";
import ProductFilterToolbar from "@/components/admin/toolbars/ProductFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminRefreshment() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const rows = [
    {
      id: 1,
      category: "Hello",
      product: "World",
      status: "inStock",
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 2,
      category: "DataGridPro",
      product: "is Awesome",
      status: "outStock",
      lastUpdated: "30/08/2023 ",
    },
    {
      id: 3,
      category: "MUI",
      product: "is Amazing",
      status: "low",
      lastUpdated: "30/08/2023 ",
    },
  ];

  const [filteredRows, setFilteredRows] = useState(rows);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);

  const isOnlyNewProductCardOpen = isAddCardOpen && !rowSelectionModel.length;

  const isOnlyEditProductCardOpen =
    rowSelectionModel.length > 0 && !isAddCardOpen;

  const isProductCardOpen = rowSelectionModel.length > 0 || isAddCardOpen;

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row: IProductRow) =>
          row.product.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (status !== "all") {
      data = data.filter((row: IProductRow) => row.status === status);
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
