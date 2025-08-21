import MultipleImageUploader from "@/components/MultipleImageUploader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { cn } from "@/lib/utils";
import { useGetDivisionsQuery } from "@/redux/features/division/division.api";
import {
  useAddTourMutation,
  useGetTourTypesQuery,
} from "@/redux/features/tour/tour.api";
import type { IErrorResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { format, formatISO } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const tourSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  location: z.string().min(1, "Location is required"),
  costFrom: z.number().min(1, "Cost is required"),
  startDate: z.date({ message: "Start date is required" }),
  endDate: z.date({ message: "End date is required" }),
  departureLocation: z.string().min(1, "Departure location is required"),
  arrivalLocation: z.string().min(1, "Arrival location is required"),
  included: z.array(z.object({ value: z.string() })),
  excluded: z.array(z.object({ value: z.string() })),
  amenities: z.array(z.object({ value: z.string() })),
  tourPlan: z.array(z.object({ value: z.string() })),
  maxGuest: z.number().min(1, "Max guest is required"),
  minAge: z.number().min(1, "Minimum age is required"),
  division: z.string().min(1, "Division is required"),
  tourType: z.string().min(1, "Tour type is required"),
});

export default function AddTour() {
  const [images, setImages] = useState<(File | FileMetadata)[] | []>([]);
  const { data: tourTypeData, isLoading: divisionLoading } =
    useGetTourTypesQuery(undefined);
  const { data: divisionData, isLoading: tourTypeLoading } =
    useGetDivisionsQuery(undefined);
  const [addTour] = useAddTourMutation();

  const form = useForm<z.infer<typeof tourSchema>>({
    resolver: zodResolver(tourSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      costFrom: undefined,
      startDate: new Date(),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
      departureLocation: "",
      arrivalLocation: "",
      included: [{ value: "" }],
      excluded: [{ value: "" }],
      amenities: [{ value: "" }],
      tourPlan: [{ value: "" }],
      maxGuest: undefined,
      minAge: undefined,
      division: "",
      tourType: "",
    },
  });

  const {
    fields: includeFields,
    append: includeAppend,
    remove: includeRemove,
  } = useFieldArray({
    control: form.control,
    name: "included",
  });

  const {
    fields: excludeFields,
    append: excludeAppend,
    remove: excludeRemove,
  } = useFieldArray({
    control: form.control,
    name: "excluded",
  });

  const {
    fields: amenitiesFields,
    append: amenitiesAppend,
    remove: amenitiesRemove,
  } = useFieldArray({
    control: form.control,
    name: "amenities",
  });

  const {
    fields: tourPlanFields,
    append: tourPlanAppend,
    remove: tourPlanRemove,
  } = useFieldArray({
    control: form.control,
    name: "tourPlan",
  });

  const divisionOptions = divisionData?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })
  );
  const tourTypeOptions = tourTypeData?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    })
  );

  const onSubmit = async (data: z.infer<typeof tourSchema>) => {
    const toastId = toast.loading("Adding Tour...");
    const tourData = {
      ...data,
      costForm: Number(data.costFrom),
      maxGuest: Number(data.maxGuest),
      minAge: Number(data.minAge),
      startDate: formatISO(data.startDate),
      endDate: formatISO(data.endDate),
      included:
        data.included[0].value === ""
          ? []
          : data.included.map((item: { value: string }) => item.value),
      excluded:
        data.excluded[0].value === ""
          ? []
          : data.excluded.map((item: { value: string }) => item.value),
      amenities:
        data.amenities[0].value === ""
          ? []
          : data.amenities.map((item: { value: string }) => item.value),
      tourPlan:
        data.tourPlan[0].value === ""
          ? []
          : data.tourPlan.map((item: { value: string }) => item.value),
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(tourData));
    images.forEach((image) => {
      formData.append("files", image as File);
    });

    console.log(tourData);

    try {
      const res = await addTour(formData).unwrap();
      if (res.success) {
        toast.success("Tour Added Successfully.", { id: toastId });
        form.reset();
      }
    } catch (err) {
      console.error(err);
      toast.error((err as IErrorResponse).message || "Something went wrong", {
        id: toastId,
      });
    }
  };

  return (
    <div className="px-5 py-5">
      <Card>
        <CardHeader>
          <CardTitle>Add New Tour</CardTitle>
          <CardDescription>Add new tour to the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              id="add-tour"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tour Title</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value || ""} />
                    </FormControl>
                    <FormDescription className="sr-only">
                      This is tour title.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* location fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is location.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="costFrom"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CostFrom</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is cost from.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* guest and age fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="maxGuest"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Maximum Guest</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is maximum guests.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minAge"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Minimum Age</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is minimum age.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* departure and arrival fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="departureLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Departure Location</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is departure location.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="arrivalLocation"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Arrival Location</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is arrival location.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* division and tour type fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="division"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Division</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={divisionLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {divisionOptions?.map(
                            (option: { value: string; label: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option?.value}
                              >
                                {option?.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You have to select division.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tourType"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={tourTypeLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {tourTypeOptions?.map(
                            (option: { value: string; label: string }) => (
                              <SelectItem
                                key={option.value}
                                value={option?.value}
                              >
                                {option?.label}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        You have to select tour type.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* start date and end date fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value)}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date <
                              new Date(
                                new Date().setDate(new Date().getDate() - 1)
                              )
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* description and image upload fields */}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Tour Description</FormLabel>
                      <FormControl>
                        <Textarea
                          className="h-52"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription className="sr-only">
                        This is tour description.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex-1 mt-5">
                  <MultipleImageUploader onChange={setImages} />
                </div>
              </div>

              {/* include fields */}
              <div className="w-full h-[1px] bg-muted rounded"></div>
              <div className="flex gap-2 justify-between items-center">
                <Label>Included</Label>
                <Button
                  onClick={() => includeAppend({ value: "" })}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-4">
                {includeFields.map((item, index) => (
                  <div className="flex gap-2 items-center">
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`included.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription className="sr-only">
                            This is tour title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => includeRemove(index)}
                      variant="outline"
                      type="button"
                      size="icon"
                      className="cursor-pointer hover:text-rose-600"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              {/* exclude fields */}
              <div className="w-full h-[1px] bg-muted rounded"></div>
              <div className="flex gap-2 justify-between items-center">
                <Label>Excluded</Label>
                <Button
                  onClick={() => excludeAppend({ value: "" })}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-4">
                {excludeFields.map((item, index) => (
                  <div className="flex gap-2 items-center">
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`excluded.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription className="sr-only">
                            What is included with tour.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => excludeRemove(index)}
                      variant="outline"
                      type="button"
                      size="icon"
                      className="cursor-pointer hover:text-rose-600"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              {/* amenities fields */}
              <div className="w-full h-[1px] bg-muted rounded"></div>
              <div className="flex gap-2 justify-between items-center">
                <Label>Amenities</Label>
                <Button
                  onClick={() => amenitiesAppend({ value: "" })}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-4">
                {amenitiesFields.map((item, index) => (
                  <div className="flex gap-2 items-center">
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`amenities.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription className="sr-only">
                            This is tour title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => amenitiesRemove(index)}
                      variant="outline"
                      type="button"
                      size="icon"
                      className="cursor-pointer hover:text-rose-600"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>

              {/* tour plan fields */}
              <div className="w-full h-[1px] bg-muted rounded"></div>
              <div className="flex gap-2 justify-between items-center">
                <Label>Tour Plan</Label>
                <Button
                  onClick={() => tourPlanAppend({ value: "" })}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                >
                  <Plus />
                </Button>
              </div>
              <div className="space-y-4">
                {tourPlanFields.map((item, index) => (
                  <div className="flex gap-2 items-center">
                    <FormField
                      key={item.id}
                      control={form.control}
                      name={`tourPlan.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input {...field} value={field.value || ""} />
                          </FormControl>
                          <FormDescription className="sr-only">
                            This is tour title.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      onClick={() => tourPlanRemove(index)}
                      variant="outline"
                      type="button"
                      size="icon"
                      className="cursor-pointer hover:text-rose-600"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ))}
              </div>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button form="add-tour" className="cursor-pointer" type="submit">
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
