import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useAddTourTypeMutation } from "@/redux/features/Tour/tour.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const tourTypeSchema = z.object({
  name: z.string().min(2).max(50),
});

export function AddTourTypeModal() {
  const form = useForm<z.infer<typeof tourTypeSchema>>({
    resolver: zodResolver(tourTypeSchema),
    defaultValues: {
      name: "",
    },
  });
  const [addTourType] = useAddTourTypeMutation();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: z.infer<typeof tourTypeSchema>) => {
    const res = await addTourType({ name: data.name }).unwrap();
    if (res.success) {
      toast.success("Tour Type Added");
      setOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="sm" variant="outline">
          <Plus /> Add Tour Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Tour Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id="add-tour-type" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Type Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is tour type name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="cursor-pointer" form="add-tour-type" type="submit">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
