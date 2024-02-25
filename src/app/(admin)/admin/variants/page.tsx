"use client";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { IVariant } from "@/components/admin/types";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { RHFUpload } from "@/components/hook-form/rhf-upload";
import React, { useState, useEffect, useCallback } from "react";
import FormProvider from "@/components/hook-form/form-provider";
import VariantDataGrid from "@/components/admin/data-grid/VariantDataGird";
import { RHFSelect, RHFSwitch, RHFTextField } from "@/components/hook-form";
import VariantFilterToolbar from "@/components/admin/toolbars/VariantFilterToolbar";
import {
  Box,
  Stack,
  Drawer,
  Button,
  MenuItem,
  Skeleton,
  Typography,
} from "@mui/material";

// ----------------------------------------------------------------------

const VARIANT_TYPE = [
  { value: "cream", label: "ครีม" },
  { value: "topBorder", label: "ขอบบน" },
  { value: "bottomBorder", label: "ขอบล่าง" },
  { value: "decoration", label: "ลายรอบเค้ก" },
  { value: "surface", label: "หน้าเค้ก" },
];

const rows = [
  {
    id: 1,
    variantType: "cream",
    variantName: "ปาดเรียบ",
    isActive: true,
    lastUpdated: "30/08/2023 ",
  },
  {
    id: 2,
    variantType: "cream",
    variantName: "ปาดไม่เรียบ",
    isActive: true,
    lastUpdated: "30/08/2023 ",
  },
  {
    id: 3,
    variantType: "topBorder",
    variantName: "ลายย้อย",
    isActive: false,
    lastUpdated: "30/08/2023 ",
  },
];

const MOCKUP_DATA = {
  creams: [
    {
      id: "a2e06756-2a32-4762-9b9d-6f669be3ac83",
      name: "ปาดเรียบ",
      imageFileName: "2024_02_23_ปาดเรียบ.png",
      imagePath:
        "variants/CREAM/a2e06756-2a32-4762-9b9d-6f669be3ac83/2024_02_23_ปาดเรียบ.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/CREAM/a2e06756-2a32-4762-9b9d-6f669be3ac83/2024_02_23_%E0%B8%9B%E0%B8%B2%E0%B8%94%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%9A.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=oBXFxXbl2JiI2aR3qqmK3JbTdmpuS2COVcH0xIEAUcomIQPZKJVSYs8JUGWoMNWX1ldgfBkDUcD666thAp0Qv%2FvL3GoUMUccQSLqAinhqgiC4yHRelm9qGNyWtsQFy%2BWPhFWh%2FE3b6xVnfhzCj6lSJhlLmWbo1yNyGKoqmMHm7YCI%2FxDvURwR4skGQ8YT9SgaD70leWFx3nD7tb%2BlInCt%2BoBVdrg5RSqqJCDk4%2F8fkUOlzhsI8Lt43CEcLFgq9joYVaEDk1M1g3sWBJ4X7bXnpMyyy6sPor7U2eJQ7sc%2FxANYhZPybmgf27basGP1dZRDKLGPbJy%2FOSVMTy3WskLFA%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:20:14.087Z",
      updatedAt: "2024-02-22T17:20:14.087Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "30e2bb1c-3dd3-4293-8ef4-0b2b3454cbe9",
      name: "ปาดไม่เรียบ",
      imageFileName: "2024_02_23_ปาดไม่เรียบ.png",
      imagePath:
        "variants/CREAM/30e2bb1c-3dd3-4293-8ef4-0b2b3454cbe9/2024_02_23_ปาดไม่เรียบ.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/CREAM/30e2bb1c-3dd3-4293-8ef4-0b2b3454cbe9/2024_02_23_%E0%B8%9B%E0%B8%B2%E0%B8%94%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%9A.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=d9yNSoMYGpZ6CH8eq96wIos5kPEWsEEoqNiv4WKfxS1PHq%2FmZLjk4mo0yvNgEe0cyem5qIuyhiPPXlFlIbSwPCzVKu30EWTMX%2F0KcS4faI3nsfpvTyhNahsMywpYI8%2FC6c0tGCBsu0lC%2FN1R1iOF%2F1AK4I5SixKOOnG3Ug9xaa%2FZupTRGoJEorsj4%2B2SFlOeYU7Hsi0SXw2shDFGbyDo4%2BrrUFRNkbhtQmmjiH0mYUj1vmQDkvOzD%2F60T8lm8jEqvh0l768onYC3EhOl%2BZ98s6loTs59a7v0DOY%2Fp%2BBTKXhaksJE0HnjH%2Fr7RzcsCWiUhtv%2BrUtzCa2CBuoxjb9hjw%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:21:16.880Z",
      updatedAt: "2024-02-22T17:21:16.880Z",
      isDeleted: false,
      deletedAt: null,
    },
  ],
  topEdges: [
    {
      id: "feefe707-64f0-48e9-9b30-5fdbb2cf325c",
      name: "ลายย้อย",
      imageFileName: "2024_02_23_ลายย้อย.png",
      imagePath:
        "variants/TOP_EDGE/feefe707-64f0-48e9-9b30-5fdbb2cf325c/2024_02_23_ลายย้อย.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/TOP_EDGE/feefe707-64f0-48e9-9b30-5fdbb2cf325c/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%A2.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=U7TWcXiLb%2BlUKiOY25%2BFt8MPFq76EJPSTrgscHQQ5Zl1Ck6hB%2FrpY8fdEYAi%2FC0LJixy7OvFnJiehx%2Bsonx8ILZrtGBZj0JMFOJfptPgt1h0WD6cZjtETc49W%2F05AoDnPDQejtz3tjxYdIRoKxB3%2B5jHDCwZV2Zc1prKZor5lXtKi1WQbf%2Funzy7W9lSa%2FNXoguFSHQ94YUujmcOcrjuws%2FqZ6h20UBLO1T7NQ38eKtg1VJXKI5DeHLVYxx4PWGZguVFUd6SqncQW7rEybFUS%2BOmSI4PsWuSyNGxJRgNQYTO8PUWBQ42YGwLsl%2FBWhtCMO3QHRL9cSiAqX2T%2B4Fp0w%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:22:01.646Z",
      updatedAt: "2024-02-22T17:22:01.646Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "23a19377-db18-4e3b-aa88-33df73ed6334",
      name: "ลายหยัก",
      imageFileName: "2024_02_23_ลายหยัก.png",
      imagePath:
        "variants/TOP_EDGE/23a19377-db18-4e3b-aa88-33df73ed6334/2024_02_23_ลายหยัก.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/TOP_EDGE/23a19377-db18-4e3b-aa88-33df73ed6334/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A2%E0%B8%B1%E0%B8%81.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=MHXyRSCbuSV3uK4XDDrSu6J3WRnYnXWTrH1G3rkfGJZSHHcxkqaeJredb3eVkYbW2qabOoT9kogfyzjYd44BjVDb5FuRaZyvLO62%2BoOiGG52elsWrdNlvNbueejvXb6UGHYuzhStbhmh%2F9T%2FyTlrWk7PFKdLDnHO8%2BF7rI2%2FOXy33%2F3qRkI0a3BMgUXxl9%2FGrRRgDUT2z3lf%2BcP73Di9WpyoWghDWiuIkOxk7LlL9myXJoJTve8uYu%2B2JQT5wHm09T%2BzGqZiVWQncjDrC%2B86tse7JNXprKdOEtEUcZ58GoYLCp7mSaOCA3f%2BdnBRn7Y%2BuQOIBQKlz%2FltWkCTJFXPfg%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:22:22.098Z",
      updatedAt: "2024-02-22T17:22:22.098Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "43ddca17-4b86-4532-a012-28c81bf46f1a",
      name: "ลายเส้น",
      imageFileName: "2024_02_23_ลายเส้น.png",
      imagePath:
        "variants/TOP_EDGE/43ddca17-4b86-4532-a012-28c81bf46f1a/2024_02_23_ลายเส้น.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/TOP_EDGE/43ddca17-4b86-4532-a012-28c81bf46f1a/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B9%80%E0%B8%AA%E0%B9%89%E0%B8%99.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=DxCRAMREVk6WwySdk1Xk9pdYwggO8ld5195OakWFt%2Bf71La1cUz%2Bf2iXVmk1U5GothW3M73PGzsGU8Lana6Znn%2FHaQKaPkpfqDnBIDNv60yIKZ2NMebIDWS03UWE5CpaObaCAhexU1%2BuUOxLRVjPUQIlaJPh9OzAL7%2FwhmRRZ4i9fsvg6KXEQTEOXDIVq46eMa3sCDsWTdmz%2BsTPUBN1N2JtjfUCIcKVCRrlfretzgv1x3eJcGpy%2Fozle2lQ%2F%2FgD4WTvof1LfonDfNezGSS8SQ3PDfx%2BgjmAoD%2BU2XUFjicYTeRNn6y5k5MloCLw2zxmN8Jzng8%2Bm9Ju70OjWkJPdA%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:22:35.378Z",
      updatedAt: "2024-02-22T17:22:35.378Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "ffcc432c-b5a5-4872-8fbb-b585a9eea2e8",
      name: "ลายจุดหยดน้ำ",
      imageFileName: "2024_02_23_ลายจุดหยดน้ำ.png",
      imagePath:
        "variants/TOP_EDGE/ffcc432c-b5a5-4872-8fbb-b585a9eea2e8/2024_02_23_ลายจุดหยดน้ำ.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/TOP_EDGE/ffcc432c-b5a5-4872-8fbb-b585a9eea2e8/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B8%AB%E0%B8%A2%E0%B8%94%E0%B8%99%E0%B9%89%E0%B8%B3.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=pCHvqY7i9nuB9k0gGiyn%2BKYe68Z3e4mWW3o2Pei%2BNCNB%2BvJiqRavX0kJfnVPu4e9y9IgJheuPfbmPELBD6PsyvDlhuMYf%2FKd3INEyzG8J9Zi3fTfo%2F3t4Zv5XVNzv4%2BkUWnJi4uqMPK4mUIpUb0JWJvoqKhDBfRuUfahK0qahgZmC%2FZX40eAy7fVtOiuthifyIWqPgHhH9Bq2LYoHU6Z9vfdsU5dvD7HoZCC0L19mJHo82oJWRnJ24je91SVw2ydD3yxBsMsqe%2B4339sYnKSS1D04D4hvAgSmAK6M6oY9%2BWJ3tsdkmHkYDwRFARMBx7mEfW43fG%2FbBefNMBSuQYSfg%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:22:47.002Z",
      updatedAt: "2024-02-22T17:22:47.002Z",
      isDeleted: false,
      deletedAt: null,
    },
  ],
  bottomEdges: [
    {
      id: "d59d7b90-0d02-4a58-ab8f-51bf9e37e1b8",
      name: "ลายจุดเล็ก",
      imageFileName: "2024_02_23_ลายจุดเล็ก.png",
      imagePath:
        "variants/BOTTOM_EDGE/d59d7b90-0d02-4a58-ab8f-51bf9e37e1b8/2024_02_23_ลายจุดเล็ก.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/BOTTOM_EDGE/d59d7b90-0d02-4a58-ab8f-51bf9e37e1b8/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%88%E0%B8%B8%E0%B8%94%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=LsmVScuGcCKm1e%2F3Dh5p6BQqNnqA1UaE1UigzS6Q3hjVxMaN2w3W2iwAl%2FBMBVwOyYHRQ38rpP3yVwst2yuzrFJA0ilpxhFuKeSyNG%2B12Co4eNiz3PnrSumRJcmEBU5wcoF6BIAlReSplgCXPpM6bBIVYS0ZWcv8AKhJbenPp2ZKtkSgfn%2FeyzPq0lHxy2veJ8QRpT3T%2BuiH1TFTB40cxUyObINH7D4cLdYk1f9PNh5dWz3EYGB5%2F%2BOLZgwdM5yQK1UjR4gtXhhMqgoPw8HyBN%2FcV6nlHvFs%2FuFNJqymlvUidI0UeLyvqj0SIG59YTSL%2FVMr5g4kEdC4t%2BDSiRm7lA%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:23:40.378Z",
      updatedAt: "2024-02-22T17:23:40.378Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "22d5c76a-29b7-49ad-83d3-e69bba378ba1",
      name: "ลายหยัก",
      imageFileName: "2024_02_23_ลายหยัก.png",
      imagePath:
        "variants/BOTTOM_EDGE/22d5c76a-29b7-49ad-83d3-e69bba378ba1/2024_02_23_ลายหยัก.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/BOTTOM_EDGE/22d5c76a-29b7-49ad-83d3-e69bba378ba1/2024_02_23_%E0%B8%A5%E0%B8%B2%E0%B8%A2%E0%B8%AB%E0%B8%A2%E0%B8%B1%E0%B8%81.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=H9PCADKb32Iak4OOAmZ6HiZ3n3jykKAF3yfqPqFtbBx1eVjfwBMVk2UuQmcaJbKFoO8rxwgq43hUmqj3PGFBptTMok4IaCJN3YLWj4%2FjhSj1KdKBIkjze96ty2wgNW6qGWsO7dPOk2xS0q%2FbemMgjfaAGwWrXedaWyX%2B4QQ6E6FCru4QLIPADS6m58MzVpo0fJYRlhyVuLs4By3%2FdcV5aZLDkuHtnskJZsPtsz9JPxd%2F9jkk9BnaWcFkJ09D3q7qDh51WVyhjLrBGeQgeLwLT0BKiBLTFFx3cXElN2d3vLhiKLUuJADFfYQq5efIYpWhyKsbbRyT4XFmhOEDOwuBIg%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:24:52.529Z",
      updatedAt: "2024-02-22T17:24:52.529Z",
      isDeleted: false,
      deletedAt: null,
    },
  ],
  decorations: [
    {
      id: "ec31d25d-05cb-4eeb-a8cf-97084a1a4adc",
      name: "ดอกไม้",
      imageFileName: "2024_02_23_ดอกไม้.png",
      imagePath:
        "variants/DECORATION/ec31d25d-05cb-4eeb-a8cf-97084a1a4adc/2024_02_23_ดอกไม้.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/DECORATION/ec31d25d-05cb-4eeb-a8cf-97084a1a4adc/2024_02_23_%E0%B8%94%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%A1%E0%B9%89.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=Kdw%2FLolx0dx5rO4PzCi%2FPfextkHQFgCFZdMexwG%2Bc%2FZIxLfpxUXqwCJusTkprqIoQQqwqbP9ia3nW%2FzZeMmdtRLRZuQ4t5vhD449QPPfmdVu286DZ2NZFXQ3zTnNVwZV5swpeIspoNPaUw10fZ1fH0SzdPLDa2E1j8hXon2BcSxyy%2BKikgd4toEc4qX2azVDlAX2SfcyVSS7a%2BQ2FL%2B5BovJrcmbSv8ymeatXf%2FT4oVsCdkT0Kbue%2FIYfFtNV70FaiFrTi7U0bNMbrskW%2B7T5VFwRx03vMQaIwFAylH6kheMiiE4JLLAbBVIpXnP45seXy%2FdlcVKvSsGqWmhu6iieQ%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:25:21.375Z",
      updatedAt: "2024-02-22T17:25:21.375Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "f47c9014-f1f3-4820-bb35-7c949fe6f5d3",
      name: "หัวใจ",
      imageFileName: "2024_02_23_หัวใจ.png",
      imagePath:
        "variants/DECORATION/f47c9014-f1f3-4820-bb35-7c949fe6f5d3/2024_02_23_หัวใจ.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/DECORATION/f47c9014-f1f3-4820-bb35-7c949fe6f5d3/2024_02_23_%E0%B8%AB%E0%B8%B1%E0%B8%A7%E0%B9%83%E0%B8%88.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=C6WLK5N2Tv4cL54oFWsONn4FLlAkOAPA43d2ukOdeEiKy30ER3c9d0j3AZenC3fUaDIIo8oCRM1g6Zq7S9agImDHTQDCtJmU3iRBcrYUohvZiTDCrLhP%2FvtygMIysWdpcIA8QmJr6tFucO4wf0q51IN73PfY0ljAxK0t8pMmi%2BjL7cYGx%2FNVetUyDr5Ilt4hGMcNuJStvR532DSyIcNuYU2BLJMzyReA877s2h8HxvVvyb9f%2BeNMVcOXGpTDYrnoTzx1BqsCZcxtP2rxCjF%2BDq3L%2FC5isLi%2BDDUmhYk9NfMG6JJQooapfxSe%2FNW%2FzvJQEDlHThg%2B5Qvj4tZwy6D9bw%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:26:14.897Z",
      updatedAt: "2024-02-22T17:26:14.897Z",
      isDeleted: false,
      deletedAt: null,
    },
    {
      id: "128269ab-15cf-4b44-9d79-5f9b9fdf14cd",
      name: "หน้ายิ้ม",
      imageFileName: "2024_02_23_หน้ายิ้ม.png",
      imagePath:
        "variants/DECORATION/128269ab-15cf-4b44-9d79-5f9b9fdf14cd/2024_02_23_หน้ายิ้ม.png",
      image:
        "https://storage.googleapis.com/cukedoh-bucket-dev/variants/DECORATION/128269ab-15cf-4b44-9d79-5f9b9fdf14cd/2024_02_23_%E0%B8%AB%E0%B8%99%E0%B9%89%E0%B8%B2%E0%B8%A2%E0%B8%B4%E0%B9%89%E0%B8%A1.png?GoogleAccessId=cukedoh-dev-sa%40cukedoh-stg.iam.gserviceaccount.com&Expires=1709383286&Signature=oOaWp%2B2N8gInTQNq57wpr0fjz1l7rkF59TIA9VCyshDPmtFFXydxjtO7Frju6VpJT6wKyNlw%2Fz8lqRIHVESY9LSc2OfPF3xVkrPsuElRB9%2FxKOsoQzr5NGXVXsyo3fYZeOPH9OjAPwO6RVpOK7mcsL43ICmNYdmB%2FSVRZylyjenNo5ubRsHBqNiQCIytN0snuAXUjoyDe%2FG07%2FgkhStLIEndRNDrcWFhK26wQuvC9toUsS7HP2b3hIj8MYFDcPIqP5rN4OgK0PhBUNQ%2BNMaJBYbDRTVl4xSBXnE1qj7v3V9Fae1jlydGdMjl9dWEpMyiGKPyqO1TCiyTdJcVm3dwQQ%3D%3D",
      isActive: true,
      createdAt: "2024-02-22T17:26:25.580Z",
      updatedAt: "2024-02-22T17:26:25.580Z",
      isDeleted: false,
      deletedAt: null,
    },
  ],
  surfaces: [],
};

// ----------------------------------------------------------------------

export default function AdminVariant() {
  const filterMethods = useForm({
    defaultValues: { search: "", variantType: "all", status: "all" },
  });

  const [selectedRow, setSelectedRow] = useState<IVariant>({
    id: "",
    name: "",
    imageFileName: "",
    imagePath: "",
    image: "",
    isActive: true,
    createdAt: "",
    updatedAt: null,
    isDeleted: false,
    deletedAt: null,
  });

  const newVariantMethods = useForm({
    defaultValues: {
      name: "",
      image: null,
      isActive: true,
    },
  });

  const editVariantMethods = useForm({
    defaultValues: selectedRow,
  });

  const [openNewDrawer, setOpenNewDrawer] = useState(false);
  const [openEditDrawer, setOpenEditDrawer] = useState(false);

  const [filteredRows, setFilteredRows] = useState(rows);

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const toggleNewDrawer = (newOpen: boolean) => () => {
    setOpenNewDrawer(newOpen);
  };
  const toggleEditDrawer = (editOpen: boolean) => () => {
    setOpenEditDrawer(editOpen);
    setRowSelectionModel([]);
  };

  const { watch } = filterMethods;

  const filterValues = watch();

  const { search, status, variantType } = filterValues;

  const {
    setValue: setValueNewVariant,
    watch: watchNewVariant,
    handleSubmit: handleSubmitNew,
  } = newVariantMethods;

  const { isActive: isActiveNewVariant } = watchNewVariant();

  const onSubmitNew = handleSubmitNew(async (data) => {
    try {
      console.log("data", data);
    } catch (error) {
      console.error(error);
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  });

  const {
    setValue: setValueEditVariant,
    watch: watchEditVariant,
    handleSubmit: handleSubmitEdit,
  } = editVariantMethods;

  const { isActive: isActiveEditVariant } = watchEditVariant();

  const onDropSingleFile = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (newFile) {
        setValueNewVariant("image", newFile as any, {
          shouldValidate: true,
        });
      }
    },
    [setValueNewVariant],
  );

  const DrawerAddVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleNewDrawer(false)}
    >
      <FormProvider methods={newVariantMethods}>
        <Stack direction="column" spacing={2.5}>
          <Typography>ตัวเลือกเค้กใหม่</Typography>
          <RHFUpload
            name="image"
            thumbnail
            onDrop={onDropSingleFile}
            onDelete={() =>
              setValueNewVariant("image", null, {
                shouldValidate: true,
              })
            }
          />
          <Typography>พรีวิว</Typography>
          <RHFUpload name="preview" thumbnail disabled />
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography>การมองเห็น:</Typography>
            <RHFSwitch
              name="isActive"
              label={isActiveNewVariant ? "โชว์" : "ซ่อน"}
            />
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <RHFTextField name="variantName" label="ชื่อตัวเลือกเค้ก" />
            <RHFSelect name="variantType" label="ประเภทตัวเลือกเค้ก">
              {VARIANT_TYPE.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
          <Button size="large" variant="contained">
            เพิ่มตัวเลือกเค้กใหม่
          </Button>
        </Stack>
      </FormProvider>
    </Box>
  );

  const isLoading = true;

  const DrawerEditVariant = (
    <Box
      sx={{ minWidth: 420, p: 4 }}
      role="presentation"
      onClick={() => toggleNewDrawer(false)}
    >
      {isLoading ? (
        <Stack spacing={2}>
          <Typography>แก้ไขตัวเลือกเค้ก</Typography>

          <Skeleton variant="rounded" width="100%" height={120} />
          <Skeleton variant="rounded" width="100%" height={120} />

          <Skeleton variant="text" sx={{ fontSize: "4rem" }} />
        </Stack>
      ) : (
        <FormProvider methods={editVariantMethods}>
          <Stack direction="column" spacing={2.5}>
            <Typography>ตัวเลือกเค้ก</Typography>
            <RHFUpload
              name="image"
              thumbnail
              onDrop={onDropSingleFile}
              onDelete={() =>
                setValueNewVariant("image", null, {
                  shouldValidate: true,
                })
              }
            />
            <Typography>พรีวิว</Typography>
            <RHFUpload name="preview" thumbnail disabled />
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>การมองเห็น:</Typography>
              <RHFSwitch
                name="isActive"
                label={isActiveEditVariant ? "โชว์" : "ซ่อน"}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <RHFTextField name="variantName" label="ชื่อตัวเลือกเค้ก" />
              <RHFSelect name="variantType" label="ประเภทตัวเลือกเค้ก">
                {VARIANT_TYPE.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
            <Button size="large" variant="contained">
              เพิ่มตัวเลือกเค้กใหม่
            </Button>
          </Stack>
        </FormProvider>
      )}
    </Box>
  );

  useEffect(() => {
    let data = rows;

    if (search) {
      data = data.filter(
        (row) =>
          row.variantName.toLowerCase().indexOf(search?.toLowerCase()) > -1,
      );
    }

    if (variantType !== "all") {
      console.log("variantType", variantType);
      data = data.filter((row) => row.variantType === variantType);
    }

    if (status !== "all") {
      if (status === "active") {
        data = data.filter((row) => row.isActive);
      } else {
        data = data.filter((row) => !row.isActive);
      }
    }
    setFilteredRows(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, variantType, status]);

  useEffect(() => {
    if (rowSelectionModel.length) {
      setOpenEditDrawer(true);
    }
  }, [rowSelectionModel]);

  return (
    <Box>
      <VariantFilterToolbar
        label="ตัวเลือกเค้ก"
        methods={filterMethods}
        onClickNewVariant={() => {
          setRowSelectionModel([]);
          setOpenNewDrawer(true);
        }}
      />

      <VariantDataGrid
        rows={filteredRows}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />

      <Drawer
        anchor="right"
        open={openNewDrawer}
        onClose={toggleNewDrawer(false)}
      >
        {DrawerAddVariant}
      </Drawer>

      <Drawer
        anchor="right"
        open={openEditDrawer}
        onClose={toggleEditDrawer(false)}
      >
        {DrawerEditVariant}
      </Drawer>
    </Box>
  );
}

// ----------------------------------------------------------------------
