import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingTable() {

  return (
    <div className="flex flex-col gap-2 justify-center mb-2">
        {
            Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="flex gap-2">
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-1/6 h-4" />
                    <Skeleton className="w-1/3 h-4" />
                </div>
            ))
        }
    </div>
  );
}