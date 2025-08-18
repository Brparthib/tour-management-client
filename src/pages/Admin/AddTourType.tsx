import { AddTourTypeModal } from "@/components/modules/Admin/TourType/AddTourTypeModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetTourTypesQuery } from "@/redux/features/Tour/tour.api";
import { Trash2 } from "lucide-react";

export default function AddTourType() {
  const { data } = useGetTourTypesQuery(undefined);

  return (
    <div className="px-5 py-5">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-xl font-bold">Tour Type List</h4>
        <AddTourTypeModal />
      </div>
      <Table className="border border-muted">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data?.map((item: { _id: string; name: string }) => (
            <TableRow key={item?._id}>
              <TableCell className="font-medium">{item?.name}</TableCell>
              <TableCell className="text-right">
                <Button
                  className="bg-transparent text-foreground hover:text-white cursor-pointer"
                  size="sm"
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
