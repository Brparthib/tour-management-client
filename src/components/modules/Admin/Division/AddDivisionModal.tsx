import SingleImageUploader from "@/components/SingleImageUploader";
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
import { Textarea } from "@/components/ui/textarea";
import type { FileMetadata } from "@/hooks/use-file-upload";
import { useAddDivisionMutation } from "@/redux/features/division/division.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const addDivisionSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(200),
});

export function AddDivisionModal() {
  const [image, setImage] = useState<(File | FileMetadata) | null>(null);
  const form = useForm<z.infer<typeof addDivisionSchema>>({
    resolver: zodResolver(addDivisionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  const [open, setOpen] = useState(false);
  const [addDivision] = useAddDivisionMutation();

  const onSubmit = async (data: z.infer<typeof addDivisionSchema>) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("file", image as File);

    const toastId = toast.loading("Division Adding");
    try {
      const res = await addDivision(formData).unwrap();
      if (res.success) {
        toast.success("Division Added Successfully", { id: toastId });
        setOpen(false);
        form.reset();
      }

      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" size="sm" variant="outline">
          <Plus /> Add Division
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Division</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            id="add-division"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Division Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is division name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription className="sr-only">
                    This is description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
          <SingleImageUploader onChange={setImage} />
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button className="cursor-pointer" form="add-division" type="submit">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
