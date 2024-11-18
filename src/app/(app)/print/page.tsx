"use client";

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Download,
  Printer,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import html2canvas from "html2canvas";
import JSZip from "jszip";

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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import {
  generateCardBack,
  generateCardFront,
  printBatchIDCards,
  printSingleIDCard,
  saveBatchIDCards,
  saveSingleIDCard,
} from "@/lib/help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRiderContext } from "@/context/riderContext";

export default function IDCardPage() {
  const { riders } = useRiderContext();
  const [selectedStudent, setSelectedStudent] = React.useState(riders[0]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const idCardRef = React.useRef<HTMLDivElement>(null);
  const [tab, setTab] = React.useState("notprinted");
  const [singleBatchTab, setSingleBatchTab] = React.useState("batch");
  const [issaving, setIssaving] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const filteredStudents = riders.filter(
    (rider) =>
      rider.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.park.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rider.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pageSize = 20;
  const totalPages = Math.ceil(filteredStudents.length / pageSize);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const [cardFront, setCardFront] = React.useState<any>("");
  const [cardBack, setCardBack] = React.useState<any>("");
  const [cardFronts, setCardFronts] = React.useState<any>([]);
  const [cardBacks, setCardBacks] = React.useState<any>([]);

  const fetchCard = async () => {
    console.log(selectedStudent);
    const front = await generateCardFront(selectedStudent);
    const back = await generateCardBack(selectedStudent);
    console.log(front);
    // console.log(back)
    setCardFront(front);
    setCardBack(back);
  };

  React.useEffect(() => {
    fetchCard();
  }, [selectedStudent, generateCardBack, generateCardFront]);

  React.useEffect(() => {
    const fetchCardFronts = async () => {
      const results = await Promise.all(
        riders.map(async (student) => {
          return await generateCardFront(student);
        })
      );
      setCardFronts(results);
    };
    const fetchCardBacks = async () => {
      const results = await Promise.all(
        riders.map(async (student) => {
          return await generateCardBack(student);
        })
      );
      setCardBacks(results);
    };

    fetchCardFronts();
    fetchCardBacks();
  }, [riders, generateCardBack, generateCardFront]);

  const handleSaveSingle = async () => {
    setIssaving(true);
    const frontImage: any = await generateCardFront(selectedStudent);
    const backImage: any = await generateCardBack(selectedStudent);

    await saveSingleIDCard(frontImage, backImage, selectedStudent.firstName);
    setIssaving(false);
  };

  const handleSaveBatch = async () => {
    setIssaving(true);
    const idCards = await Promise.all(
      paginatedStudents.map(async (student) => {
        const front: any = await generateCardFront(student);
        const back: any = await generateCardBack(student);
        return { front, back };
      })
    );

    await saveBatchIDCards(idCards);
    setIssaving(false);
  };

  const handlePrintSingle = async () => {
    setIsPrinting(true);
    const frontImage: any = await generateCardFront(selectedStudent);
    const backImage: any = await generateCardBack(selectedStudent);

    await printSingleIDCard(frontImage, backImage);
    setIsPrinting(false);
  };

  const handlePrintBatch = async () => {
    setIsPrinting(true);
    const idCards = await Promise.all(
      paginatedStudents.map(async (student) => {
        const front: any = await generateCardFront(student);
        const back: any = await generateCardBack(student);
        return { front, back };
      })
    );
    await printBatchIDCards(idCards);
    setIsPrinting(false);
  };
  return (
    <div className=" h-screen ">
      <Tabs defaultValue="notprinted" onValueChange={setTab}>
        <div className="fixed w-[calc(100%-250px)] px-4 mt-[70px] border-b  md:ml-[250px] right-0 top-0 z-50  h-[50px] bg-card flex items-center  justify-between  ">
          <div className="h-full flex items-center ">
            <TabsList className="border">
              <TabsTrigger value="notprinted">Not Printed</TabsTrigger>
              <TabsTrigger value="printed">Printed</TabsTrigger>
            </TabsList>
          </div>

          {tab === "notprinted" && (
            <Tabs
              defaultValue="batch"
              onValueChange={setSingleBatchTab}
              className="w-[400px]"
            >
              <TabsList>
                <TabsTrigger value="batch">Batch</TabsTrigger>
                <TabsTrigger value="single">Single</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {tab === "notprinted" && singleBatchTab !== "single" && (
            <div className="h-full flex gap-4 items-center self-center ">
              <Button onClick={handleSaveBatch} disabled={issaving}>
                <Download className="mr-2 h-4 w-4" />
                {issaving ? "Downloading.." : " Download Batch ID Card"}
              </Button>
              <Button onClick={handlePrintBatch} disabled={isPrinting}>
                <Printer className="mr-2 h-4 w-4" />

                {isPrinting ? "Printing.." : "Print"}
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="printed" className="w-full flex p-0  ">
          <div className="w-1/3 border-r bg-white h-[calc(100vh-120px)] mt-[40px] relative">
            <div className=" h-[60px] flex items-center p-2 w-full ">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-auto absolute w-full h-[calc(100%-140px)] overflow-y-auto ">
              <Table>
                <TableHeader>
                  <TableRow className="p-0">
                    <TableHead>Photo</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="p-4">
                  {paginatedStudents.map((rider) => (
                    <TableRow
                      key={rider.id}
                      className={`cursor-pointer ${
                        selectedStudent.id === rider.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedStudent(rider)}
                    >
                      <TableCell>
                        <img
                          alt="photo"
                          src={rider.photo || "/profile.png"}
                          width={100}
                          height={100}
                          className="w-8 h-8 rounded-md"
                        />
                      </TableCell>
                      <TableCell>{rider.id}</TableCell>
                      <TableCell>{`${rider.firstName} ${
                        rider.middleName ? rider.middleName : ""
                      } ${rider.surname}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="absolute w-full h-[80px] bottom-0 mt-4 flex items-center justify-between p-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-1/2 flex-1 p-6 h-[calc(100vh-120px)] mt-[40px] overflow-y-auto">
            {selectedStudent && (
              <div className="space-y-6">
                <div className="flex gap-4 w-full relative ">
                  <Image
                    height={500}
                    width={500}
                    className=" w-1/2 rounded-md shadow-lg"
                    src={cardFront}
                    alt=""
                  />
                  <Image
                    height={500}
                    width={500}
                    className=" w-1/2 rounded-md shadow-lg"
                    src={cardBack}
                    alt=""
                  />
                </div>

                {/* Student Details */}
                <div className="w-full rounded-lg border bg-white p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Rider Details</h3>
                    <div className="space-x-2">
                      <Button onClick={handleSaveSingle} disabled={issaving}>
                        <Download className="mr-2 h-4 w-4" />

                        {issaving ? "Downloading.." : " Download ID Card"}
                      </Button>

                      <Button onClick={handlePrintSingle} disabled={isPrinting}>
                        <Printer className="mr-2 h-4 w-4" />
                        {isPrinting ? "Printing.." : " Print Card"}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">
                        {`${selectedStudent.firstName} ${
                          selectedStudent.middleName
                            ? selectedStudent.middleName
                            : ""
                        } ${selectedStudent.surname}`}{" "}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Student ID</p>
                      <p className="font-medium">{selectedStudent.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">District</p>
                      <p className="font-medium">{selectedStudent.district}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Park</p>
                      <p className="font-medium">{selectedStudent.park}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {format(
                          new Date(selectedStudent.dateOfBirth),
                          "dd/MM/yyyy"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Sex</p>
                      <p className="font-medium">{selectedStudent.sex}</p>
                    </div>
                    {/* <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedStudent.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{selectedStudent.address}</p>
                </div> */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="notprinted" className="w-full flex p-0  ">
          <div className="w-1/3 border-r bg-white h-[calc(100vh-120px)] mt-[40px] relative">
            <div className=" h-[60px] flex items-center p-2 w-full ">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-auto absolute w-full h-[calc(100%-140px)] overflow-y-auto ">
              <Table>
                <TableHeader>
                  <TableRow className="p-0">
                    <TableHead>Photo</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="p-4">
                  {paginatedStudents.map((rider) => (
                    <TableRow
                      key={rider.id}
                      className={`cursor-pointer ${
                        selectedStudent.id === rider.id ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedStudent(rider)}
                    >
                      <TableCell>
                        <img
                          alt="photo"
                          src={rider.photo || "/profile.png"}
                          width={100}
                          height={100}
                          className="w-8 h-8 rounded-md"
                        />
                      </TableCell>
                      <TableCell>{rider.id}</TableCell>
                      <TableCell>{`${rider.firstName} ${
                        rider.middleName ? rider.middleName : ""
                      } ${rider.surname}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="absolute w-full h-[80px] bottom-0 mt-4 flex items-center justify-between p-4">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {singleBatchTab === "single" ? (
            <div className="w-1/2 flex-1 p-6 h-[calc(100vh-120px)] mt-[40px] overflow-y-auto">
              {selectedStudent && (
                <div className="space-y-6">
                  <div className="flex gap-4 w-full relative ">
                    <Image
                      height={500}
                      width={500}
                      className=" w-1/2 rounded-md shadow-lg"
                      src={cardFront ? cardFront : "/frontbg.png"}
                      alt=""
                    />
                    <Image
                      height={500}
                      width={500}
                      className=" w-1/2 rounded-md shadow-lg"
                      src={cardBack ? cardBack : "/backbg.png"}
                      alt=""
                    />
                  </div>

                  {/* Student Details */}
                  <div className="w-full rounded-lg border bg-white p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Rider Details</h3>
                      <div className="space-x-2">
                        <Button onClick={handleSaveSingle} disabled={issaving}>
                          <Download className="mr-2 h-4 w-4" />

                          {issaving ? "Downloading.." : " Download ID Card"}
                        </Button>
                        <Button
                          onClick={handlePrintSingle}
                          disabled={isPrinting}
                        >
                          <Printer className="mr-2 h-4 w-4" />
                          {isPrinting ? "Printing.." : " Print Card"}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium">
                          {`${selectedStudent.firstName} ${
                            selectedStudent.middleName
                              ? selectedStudent.middleName
                              : ""
                          } ${selectedStudent.surname}`}{" "}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Student ID</p>
                        <p className="font-medium">{selectedStudent.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">District</p>
                        <p className="font-medium">
                          {selectedStudent.district}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Park</p>
                        <p className="font-medium">{selectedStudent.park}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date of Birth</p>
                        <p className="font-medium">
                          {format(
                            new Date(selectedStudent.dateOfBirth),
                            "dd/MM/yyyy"
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sex</p>
                        <p className="font-medium">{selectedStudent.sex}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-1/2 flex-1 p-6 pr-7 space-y-4 h-[calc(100vh-120px)] mt-[40px] overflow-y-auto">
              {riders.map((student, index) => (
                <div key={index} className="flex gap-4 w-full relative ">
                  <Image
                    height={500}
                    width={500}
                    className=" w-1/2 rounded-md shadow-lg"
                    src={cardFronts[index] ? cardFronts[index] : "/frontbg.png"}
                    alt=""
                  />
                  <Image
                    height={500}
                    width={500}
                    className=" w-1/2 rounded-md shadow-lg"
                    src={cardBacks[index] ? cardBacks[index] : "/backbg.png"}
                    alt=""
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
