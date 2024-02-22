"use client";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { GridEventListener } from "@mui/x-data-grid";
import OrderDataGrid from "@/components/admin/data-grid/OrderDataGrid";
import OrderFilterToolbar from "@/components/admin/toolbars/OrderFilterToolbar";

// ----------------------------------------------------------------------

export default function AdminOrder() {
  const router = useRouter();
  const filterMethods = useForm({
    defaultValues: { search: "", status: "all" },
  });

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status } = filterValues;

  const rows = [
    {
      id: 1,
      customer: "Thanatuch Lertritsirikul",
      phone: "1234567890",
      paymentType: "จ่ายมัดจำ",
      orderDate: "30/08/2023",
      orderStatus: "complete",
    },
    {
      id: 2,
      customer: "Thanatuch Lertritsirikul",
      phone: "1234567890",
      paymentType: "จ่ายเต็มจำนวน",
      orderDate: "30/08/2023",
      orderStatus: "pendingOrder",
    },
  ];

  const [filteredRows, setFilteredRows] = useState(rows);

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row: any) =>
          row.customer.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (status !== "all") {
      data = data.filter((row: any) => row.orderStatus === status);
    }
    setFilteredRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status]);

  const onRowClick: GridEventListener<"rowClick"> = (params) => {
    router.push(`/admin/orders/${params.id}`);
  };

  return (
    <Box>
      <OrderFilterToolbar label="ออเดอร์" methods={filterMethods} />

      <OrderDataGrid rows={filteredRows} onRowClick={onRowClick} />
    </Box>
  );
}
