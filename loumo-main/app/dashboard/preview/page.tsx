'use client'
import ProductQuery from '@/queries/product';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import JsonView from "react18-json-view";

function page() {
    const product = new ProductQuery();
  const productData = useQuery({
    queryKey: ["productFetchAll"],
    queryFn: () => product.getAll(),
  });
  return (
        <div className="max-w-3xl mx-auto mt-10">
        <h1 className="mb-4">Product Data</h1>
        <JsonView src={productData.data} />
      </div>
  )
}

export default page