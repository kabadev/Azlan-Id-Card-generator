"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import IdCardDetail from "@/components/Idcard/IdCardDetail";
import { useRiderContext } from "@/context/riderContext";
import { Rider } from "@/types/idcard-type";

export default function IDCardPage() {
  const {
    riders,
    totalRiders,
    totalFetchedRiders,
    currentPage,
    isLoading,
    searchQuery,
    fetchRiders,
    setCurrentPage,
    setSearchQuery,
  } = useRiderContext();

  const [selectedRider, setSelectedRider] = React.useState(riders[0] || null);
  const [filteredRiders, setFilteredRiders] = React.useState<Rider[]>([]);

  const pageSize = 50;
  const totalPages = Math.ceil(filteredRiders.length / pageSize);

  const paginatedRiders = React.useMemo(() => {
    return filteredRiders.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredRiders, currentPage]);

  React.useEffect(() => {
    if (riders.length > 0 && !selectedRider) {
      setSelectedRider(riders[0]);
    }
  }, [riders, selectedRider]);

  React.useEffect(() => {
    const filtered = riders.filter(
      (rider) =>
        rider.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.surName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.park.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rider.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRiders(filtered);
  }, [riders, searchQuery]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side - Student List */}
      <div className="w-1/3 border-r bg-white h-[calc(100vh-70px)] relative ">
        <div className="h-[60px] flex items-center p-2 w-full">
          <div className="relative w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-auto absolute w-full h-[calc(100%-140px)] overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="p-0">
                <TableHead>Photo</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="p-4">
              {paginatedRiders.map((rider) => (
                <TableRow
                  key={rider.id}
                  className={`cursor-pointer ${
                    selectedRider?.id === rider.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedRider(rider)}
                >
                  <TableCell>
                    <Image
                      alt="photo"
                      src={rider.photo || "/profile.png"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-md"
                    />
                  </TableCell>
                  <TableCell>{rider.id}</TableCell>
                  <TableCell>{`${rider.firstName} ${
                    rider.middleName ? rider.middleName : ""
                  } ${rider.surName}`}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="absolute w-full h-[80px] bottom-0 mt-4 flex items-center justify-between p-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => {
              setCurrentPage((prev) => {
                const nextPage = prev + 1;
                if (nextPage * pageSize >= totalFetchedRiders - pageSize) {
                  fetchRiders();
                }
                return nextPage;
              });
            }}
            disabled={currentPage * pageSize >= totalRiders || isLoading}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right side - Student Details and ID Card */}
      <div className="flex-1 p-6 h-[calc(100vh-70px)] overflow-y-auto bg-background">
        {selectedRider && (
          <IdCardDetail
            setSelectedRider={setSelectedRider}
            rider={selectedRider}
          />
        )}
      </div>
    </div>
  );
}
