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

const MOCKUP_DATA: ISnackBoxRow[] = [
  {
    id: "602e3fb6-0e63-4d69-be69-a699f5aeda85",
    price: 12.5,
    name: "snack 1",
    description: "This one is nice",
    imageFileName: null,
    imagePath: null,
    image: "",
    weight: 0.5,
    height: 1,
    length: 1,
    width: 1,
    isActive: true,
    isDeleted: false,
    deletedAt: null,
    type: "PRESET",
    packageType: "PAPER_BAG",
    beverage: "INCLUDE",
    refreshments: [
      {
        id: "7cc5ab3c-3965-4519-8c1c-a2120c4cb51d",
        refreshmentId: "982d6fa7-5f27-4b57-a40d-f5dfad56ac52",
        snackBoxId: "602e3fb6-0e63-4d69-be69-a699f5aeda85",
        refreshment: {
          id: "982d6fa7-5f27-4b57-a40d-f5dfad56ac52",
          name: "Cake 2",
          description: null,
          remark: null,
          quantity: 12,
          imageFileName: "2024_02_17_cute_cat.jpeg",
          imagePath:
            "refreshments/CAKE/982d6fa7-5f27-4b57-a40d-f5dfad56ac52/2024_02_17_cute_cat.jpeg",
          image:
            "https://storage.googleapis.com/cukedoh-bucket-dev/refreshments/CAKE/982d6fa7-5f27-4b57-a40d-f5dfad56ac52/2024_02_17_cute_cat.jpeg?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709379773&Signature=fTKbib1f5gfcGXVicKe1y5dWc2SSMYur30SmVvsGSt%2FIaIWbS2xE2aawteGeA%2F9%2BSAFTP4pfS2B7Om339ut4dKFnoVjIEVpQZnQHCpIiTb0Bgalawty%2ByR2rsrMiKXZpN7wsll9TG8iKpSpKYEn8aKfzx%2BNxp3enxcjcEiznD3pzEwbnldczhk5u%2B8vPsRvvLCY8NS%2BwoI99tMHhroClEyHBQ%2FZIaiDZFAnW%2FmsQzJSWPkgZtzbYkxrkhl7tvDmT4j3b4N5BMOL661pP5MP9IG0W0iLJGRw8VotvCDP8tBqVlV25NtmAxzNdzjIdXDc4roOwHhI7qMexx7suUrQpOw%3D%3D",
          type: "BAKERY",
          category: "CAKE",
          status: "LOW",
          minQty: 1,
          maxQty: 12,
          currQty: 2,
          weight: 0.5,
          height: 1,
          length: 1,
          width: 1,
          price: 12.5,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-02-17T16:48:50.127Z",
          updatedAt: "2024-02-17T16:48:51.047Z",
          deletedAt: null,
          unitType: "กล่อง",
        },
      },
      {
        id: "336f9fdb-5dce-43a5-a3da-d1dd23314aab",
        refreshmentId: "6dd5d079-12e9-47c8-81fa-2c22756d1702",
        snackBoxId: "602e3fb6-0e63-4d69-be69-a699f5aeda85",
        refreshment: {
          id: "6dd5d079-12e9-47c8-81fa-2c22756d1702",
          name: "Cake 1",
          description: null,
          remark: null,
          quantity: 12,
          imageFileName: "2024_02_17_cute_cat.jpeg",
          imagePath:
            "refreshments/CAKE/6dd5d079-12e9-47c8-81fa-2c22756d1702/2024_02_17_cute_cat.jpeg",
          image:
            "https://storage.googleapis.com/cukedoh-bucket-dev/refreshments/CAKE/6dd5d079-12e9-47c8-81fa-2c22756d1702/2024_02_17_cute_cat.jpeg?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709379773&Signature=enOYwBtN%2Bs5%2BqtW6vhuuVHlzGQJhWoK5U2r1jRnLHYdcEUj1coJ4sejmhtc9I7In3pTY2KQtDE1HjWTJTr3Hzo0ipQNuiS4cmu%2FTSAP9YxXVr%2FnIThVb4wdReZ0BXxf%2BUAFvTKZVCJdgfkMFGumMY9ZlYTsjP4GOjCLnjQleoGBs7NCJ4zZQYvk4pqrhbhHAWUf1LeMpdLKT8N8P%2FXdYvpVI7hwRYvC6sAmrV45L%2F1mxVRdTGYOOLsqOyKP1puCBxOEi6DIwrJpTG5J3myUCUQVeAGFuRxLHngsHvzupR473eShdHfYJhN%2B8NCDt0cBq8IbVcAddFD5jmPIquvvwkQ%3D%3D",
          type: "BAKERY",
          category: "CAKE",
          status: "LOW",
          minQty: 1,
          maxQty: 12,
          currQty: 2,
          weight: 0.5,
          height: 1,
          length: 1,
          width: 1,
          price: 12.5,
          isActive: true,
          isDeleted: false,
          createdAt: "2024-02-17T16:48:45.914Z",
          updatedAt: "2024-02-17T16:48:47.389Z",
          deletedAt: null,
          unitType: "กล่อง",
        },
      },
    ],
    createdAt: "",
    updatedAt: "",
  },
];

// ----------------------------------------------------------------------

export default function AdminSnackBox() {
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  const {
    productsData: products,
    snackBoxData: snackBoxes,
    snackBoxIsLoading: isLoading,
  } = useAdmin();

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

  useEffect(() => {
    setFilteredRows(snackBoxes?.data || []);
  }, [snackBoxes]);

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
