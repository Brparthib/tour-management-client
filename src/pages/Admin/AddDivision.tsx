import { DeleteConfirmation } from "@/components/DeleteConfirmation";
import { AddDivisionModal } from "@/components/modules/Admin/Division/AddDivisionModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetDivisionsQuery,
  useRemoveDivisionMutation,
} from "@/redux/features/division/division.api";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AddDivision() {
  const { data } = useGetDivisionsQuery(undefined);
  const [removeDivision] = useRemoveDivisionMutation();

  const handleRemoveDivision = async (divisionId: string) => {
    const toastId = toast.loading("Removing Division...");
    try {
      const res = await removeDivision(divisionId).unwrap();
      if (res.success) {
        toast.success("Division Removed Successfully", { id: toastId });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-5 py-5">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-xl font-bold">Division List</h4>
        <AddDivisionModal />
      </div>
      <Table className="border border-muted">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead className="w-[100px]">Image</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map(
            (item: { _id: string; name: string; thumbnail: string }) => (
              <TableRow key={item?._id}>
                <TableCell className="font-medium">{item?.name}</TableCell>
                <TableCell className="font-medium">
                  <img
                    className="w-10 h-10 border border-muted-foreground rounded"
                    src={item?.thumbnail}
                    alt=""
                  />
                </TableCell>
                <TableCell className="text-right">
                  <DeleteConfirmation
                    onConfirm={() => handleRemoveDivision(item._id)}
                  >
                    <Button
                      variant="ghost"
                      className="bg-transparent text-foreground hover:text-rose-600 cursor-pointer"
                      size="sm"
                    >
                      <Trash2 />
                    </Button>
                  </DeleteConfirmation>
                </TableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  );
}
