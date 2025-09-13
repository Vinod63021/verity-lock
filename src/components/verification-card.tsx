
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeCheck, BadgeX, Loader2, Search } from "lucide-react";
import type { MismatchFindingResult } from "@/lib/types";
import { findAndVerifyAds } from "@/ai/flows";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/app-context";

const verificationSchema = z.object({
  productIds: z.array(z.string()).refine((value) => value.length > 0, {
    message: "Please select at least one product.",
  }),
});


export default function VerificationCard() {
  const { toast } = useToast();
  const { user, products, isStateLoading } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MismatchFindingResult | null>(null);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      productIds: [],
    },
  });

  useEffect(() => {
    form.reset({ productIds: [] });
  }, [products, form]);

  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    setIsLoading(true);
    setResult(null);

    const selectedProduct = products.find(p => p.id === values.productIds[0]);
    if (!selectedProduct) {
        toast({ title: "Error", description: "Selected product not found.", variant: "destructive"});
        setIsLoading(false);
        return;
    }

    if (!user.avatarUrl || !user.avatarUrl.startsWith("data:image")) {
      toast({
        variant: "destructive",
        title: "Profile Picture Required",
        description: "Please upload a profile picture first to perform face verification.",
      });
      setIsLoading(false);
      return;
    }

    if (!selectedProduct.imageUrl || !selectedProduct.imageUrl.startsWith("data:image")) {
      toast({
        variant: "destructive",
        title: "Product Image Required",
        description: `The selected product "${selectedProduct.name}" does not have an uploaded image. Please add an image to the product first.`,
      });
      setIsLoading(false);
      return;
    }


    try {
        const findingResult = await findAndVerifyAds({
            userFaceDataUri: user.avatarUrl,
            productName: selectedProduct.name,
            productDescription: selectedProduct.description,
            productImageDataUri: selectedProduct.imageUrl,
            registeredProductNames: products.map(p => p.name),
        });
        
        setResult(findingResult);

    } catch (error) {
        console.error("Verification failed:", error);
        toast({
            title: "Verification Failed",
            description: "An unexpected error occurred during AI analysis. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };

  if (isStateLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Skeleton className="ml-auto h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Ad Verification</CardTitle>
        <CardDescription>
          Select products and our AI will search for and verify your video ads across the web.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="productIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">Products to Verify</FormLabel>
                    <FormDescription>
                      Select products to verify. The AI uses the first selection as the main search target.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 rounded-md border p-4 sm:grid-cols-3 md:grid-cols-4">
                    {products.map((product) => (
                      <FormField
                        key={product.id}
                        control={form.control}
                        name="productIds"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={product.id}
                              className="flex flex-row items-center space-x-2 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(product.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, product.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== product.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {product.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoading && (
              <div className="space-y-4 rounded-lg border border-dashed p-6">
                <div className="flex items-center justify-center gap-3 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="font-semibold">Searching for ads and analyzing... This may take a few moments.</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <Skeleton className="h-10" />
                </div>
              </div>
            )}

            {result && !isLoading && (
                <div className="space-y-4">
                 <Alert variant={result.mismatchFound ? "destructive" : "default"} className={!result.mismatchFound ? "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300" : ""}>
                    {!result.mismatchFound ? <BadgeCheck className="h-5 w-5 text-green-600 dark:text-green-400" /> : <BadgeX className="h-5 w-5 text-destructive" />}
                    <AlertTitle className="font-bold">{result.mismatchFound ? "Mismatch Found" : "No Mismatches Found"}</AlertTitle>
                    <AlertDescription>
                        {result.report}
                    </AlertDescription>
                    
                    {result.mismatchFound && result.videoDetails && (
                        <div className="mt-4 space-y-3 rounded-md border border-destructive/50 bg-destructive/5 p-4 text-sm">
                            <h4 className="font-semibold text-destructive">Mismatched Video Details:</h4>
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <div className="relative aspect-video w-full flex-shrink-0 sm:w-48">
                                    <Image
                                        src={result.videoDetails.thumbnailUrl}
                                        alt={`Thumbnail for ${result.videoDetails.title}`}
                                        fill={true}
                                        className="rounded-md object-cover"
                                        data-ai-hint="video thumbnail"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h5 className="font-bold text-destructive">{result.videoDetails.title}</h5>
                                    <p className="text-xs text-destructive/80">{result.videoDetails.channelName}</p>
                                    <ul className="mt-2 space-y-1 text-destructive/90">
                                        <li><strong>Views:</strong> {result.videoDetails.viewCount.toLocaleString()}</li>
                                        <li><strong>Published:</strong> {result.videoDetails.publishDate}</li>
                                        <li><strong>Duration:</strong> {result.videoDetails.videoLength}</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p><strong>Summary:</strong> {result.videoDetails.summary}</p>
                            </div>
                        </div>
                    )}
                </Alert>
                </div>
            )}

          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" disabled={isLoading || products.length === 0} className="ml-auto">
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search /> Find & Verify Ads
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
