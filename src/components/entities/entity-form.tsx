"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db, MOCK_ORGANISATION } from "@/lib/mockdb";
import { ENTITY_TYPE_LABELS, FINANCIAL_YEAR_OPTIONS, INDIAN_STATES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { EntityType } from "@/lib/types";
import { toast } from "sonner";

const entitySchema = z.object({
  legal_name: z.string().min(2, "Legal name is required"),
  short_name: z.string().optional(),
  entity_type: z.enum([
    "private_limited", "public_limited", "llp", "partnership",
    "trust_private", "trust_public", "huf", "proprietorship"
  ] as const),
  status: z.enum(["active", "struck_off", "under_liquidation", "dormant"]),
  pan: z.string().regex(/[A-Z]{5}[0-9]{4}[A-Z]/, "Invalid PAN format").optional().or(z.literal("")),
  cin: z.string().length(21, "CIN must be 21 characters").optional().or(z.literal("")),
  llpin: z.string().optional().or(z.literal("")),
  date_of_incorporation: z.string().optional(),
  state_of_incorporation: z.string().optional(),
  financial_year_end: z.string().default("march_31"),
  nature_of_business: z.string().optional(),
  address_line1: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pin_code: z.string().optional(),
});

type EntityFormValues = z.infer<typeof entitySchema>;

interface EntityFormProps {
  initialData?: any;
  id?: string;
}

export function EntityForm({ initialData, id }: EntityFormProps) {
  const router = useRouter();
  const form = useForm<EntityFormValues>({
    resolver: zodResolver(entitySchema),
    defaultValues: initialData || {
      legal_name: "",
      entity_type: "private_limited",
      status: "active",
      financial_year_end: "march_31",
    },
  });

  const onSubmit = (values: EntityFormValues) => {
    try {
      if (id) {
        // Update logic (mock)
        toast.success("Entity updated successfully");
      } else {
        db.addEntity({
          ...values,
          organisation_id: MOCK_ORGANISATION.id,
          completeness_score: 50, // Default for now
          entity_type: values.entity_type as EntityType,
        } as any);
        toast.success("Entity created successfully");
      }
      router.push("/entities");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card className="md:col-span-2 border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="legal_name"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Legal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter legal name of the entity" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="short_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Name / Alias</FormLabel>
                    <FormControl>
                      <Input placeholder="Acme Pvt Ltd" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="entity_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entity Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ENTITY_TYPE_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Identifiers */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Identifiers</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="pan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permanent Account Number (PAN)</FormLabel>
                    <FormControl>
                      <Input placeholder="ABCDE1234F" {...field} className="font-mono uppercase" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("entity_type") === "llp" ? (
                <FormField
                  control={form.control}
                  name="llpin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LLPIN</FormLabel>
                      <FormControl>
                        <Input placeholder="AAA-1234" {...field} className="font-mono" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="cin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corporate Identity Number (CIN)</FormLabel>
                      <FormControl>
                        <Input placeholder="U12345MH2010PTC123456" {...field} className="font-mono uppercase" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Operations */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Operations</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="date_of_incorporation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Incorporation</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="financial_year_end"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Year End</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select FY end" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {FINANCIAL_YEAR_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="md:col-span-2 border-border/50 bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg">Registered Address</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="address_line1"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Building, Street, Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mumbai" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pin_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input placeholder="400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            {id ? "Update Entity" : "Create Entity"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
