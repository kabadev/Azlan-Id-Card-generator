"use client";

import * as React from "react";
import { Download, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  generateCardBack,
  generateCardFront,
  generateExCardBack,
  generateExCardFront,
  printBatchIDCards,
  saveBatchIDCards,
} from "@/lib/help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { PrintedIDCards } from "@/components/Idcard/PrintedIDCards";
import { NotPrintedIDCards } from "@/components/Idcard/NotPrintedIDCards";
import { Rider } from "@/types/idcard-type";
import { useRiderContext } from "@/context/riderContext";
import { useRouter } from "next/navigation";

export default function IDCardPage() {
  const { updatePrintedRiders } = useRiderContext();
  const [tab, setTab] = React.useState("notprinted");
  const [singleBatchTab, setSingleBatchTab] = React.useState("batch");
  const [issaving, setIssaving] = React.useState(false);
  const [isPrinting, setIsPrinting] = React.useState(false);
  const [childData, setChildData] = React.useState<Rider[]>([]);
  const router = useRouter();
  const handleSaveBatch = async () => {
    setIssaving(true);
    const idCards = await Promise.all(
      childData.map(async (rider) => {
        const frontP: any = await generateExCardFront(rider);
        const backP: any = await generateExCardBack(rider);

        const front: any = await generateCardFront(rider);
        const back: any = await generateCardBack(rider);

        const general = { front, back, type: rider.type };
        const executive = { front, back, type: rider.type, frontP, backP };

        return rider.type === "General" ? general : executive;
      })
    );

    try {
      await saveBatchIDCards(idCards);
      updatePrintedRiders(childData);
      router.refresh();
      setIsPrinting(false);
    } catch (error) {
      console.log(error);
    }
    setIsPrinting(false);
  };

  const handlePrintBatch = async () => {
    setIsPrinting(true);
    const idCards = await Promise.all(
      childData.map(async (rider) => {
        const frontP: any = await generateExCardFront(rider);
        const backP: any = await generateExCardBack(rider);

        const front: any = await generateCardFront(rider);
        const back: any = await generateCardBack(rider);

        const general = { front, back, type: rider.type };
        const executive = { front, back, type: rider.type, frontP, backP };

        return rider.type === "General" ? general : executive;
      })
    );

    try {
      await updatePrintedRiders(childData);
      await printBatchIDCards(idCards);
      router.refresh();
      setIsPrinting(false);
    } catch (error) {
      console.log(error);
    }
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
          <PrintedIDCards />
        </TabsContent>
        <TabsContent value="notprinted" className="w-full flex p-0  ">
          <NotPrintedIDCards
            singleBatchTab={singleBatchTab}
            onProvideData={(data: any) => setChildData(data)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
