"use client";

import ProfileForm from "@/components/profile-form";
import ProductsCard from "@/components/products-card";
import { useAppContext } from "@/context/app-context";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardClient() {
  const { user, products, addProduct, updateUser, removeProduct, isStateLoading } = useAppContext();

  if (isStateLoading) {
    return (
      <div className="grid grid-cols-1 gap-8">
        <Skeleton className="h-[350px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8">
      <ProfileForm user={user} onUserUpdate={updateUser} />
      <ProductsCard products={products} onProductAdd={addProduct} onProductRemove={removeProduct} />
    </div>
  );
}
