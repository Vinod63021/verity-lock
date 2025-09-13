"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, ShieldCheck, X } from "lucide-react";
import AddProductDialog from "./add-product-dialog";
import type { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

type ProductsCardProps = {
  products: Product[];
  onProductAdd: (product: Product) => void;
  onProductRemove: (productId: string) => void;
};

export default function ProductsCard({ products, onProductAdd, onProductRemove }: ProductsCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRemoveClick = (product: Product) => {
    onProductRemove(product.id);
    toast({
        title: "Product Removed",
        description: `${product.name} has been removed from your list.`
    });
  };

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Your Products</CardTitle>
            <CardDescription>
              Products you are registered to advertise.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={products.length === 0}
              onClick={() => router.push("/dashboard/verify")}
            >
              <ShieldCheck />
              Verify Products
            </Button>
            <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle />
              Add Product
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {products.map((product) => (
                <div key={product.id} className="group relative text-center">
                  <div className="relative aspect-square overflow-hidden rounded-lg border bg-card shadow-sm transition-all group-hover:shadow-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={150}
                      height={150}
                      className="h-full w-full object-cover"
                      data-ai-hint="product image"
                    />
                    <button
                      onClick={() => handleRemoveClick(product)}
                      className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-all hover:bg-destructive group-hover:opacity-100"
                      aria-label={`Remove ${product.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 truncate text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 text-center">
              <p className="text-muted-foreground">No products added yet.</p>
              <Button variant="link" onClick={() => setIsAddDialogOpen(true)}>
                Add your first product
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <AddProductDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onProductAdd={onProductAdd}
      />
    </>
  );
}
