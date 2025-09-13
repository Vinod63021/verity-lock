"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  return (
    <Card>
      <CardHeader>
        {/* Can add title here if needed */}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="alex.doe@example.com" defaultValue="alex.doe@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" defaultValue="password123" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full">
            <Link href="/dashboard">Sign In</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
            This is a demo. Any email/password will work.
        </p>
      </CardFooter>
    </Card>
  );
}
