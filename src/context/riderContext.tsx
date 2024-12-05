"use client";
import { extractIds } from "@/lib/utils";
import { Rider } from "@/types/idcard-type";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react";

// Context State Type
interface RiderContextState {
  riders: Rider[];
  notPrintedRiders: Rider[];
  printedRiders: Rider[];
  addRider: (newRider: Rider) => void;
  updateRider: (updatedRider: Rider) => void;
  deleteRider: (id: string) => void;
  fetchRiders: () => void;
  fetchPrintedRiders: () => void;
  fetchNotPrintedRiders: () => void;
  updatePrintedRiders: (riders: any) => void;

  totalRiders: number;
  totalFetchedRiders: number;
  currentPage: number;
  isLoading: boolean;
  searchQuery: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const RiderContext = createContext<RiderContextState | undefined>(undefined);

// Provider Component
export const RiderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isSignedIn, user, isLoaded } = useUser();
  const [riders, setRiders] = useState<Rider[]>([]);
  const [notPrintedRiders, setNotPrintedRiders] = useState<Rider[]>([]);
  const [printedRiders, setPrintedRiders] = useState<Rider[]>([]);
  const [isSubmiting, setISubmiting] = useState<boolean>(false);
  const [totalRiders, setTotalRiders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalFetchedRiders, setTotalFetchedRiders] = useState(0);

  const fetchRiders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/riders?page=${Math.ceil(currentPage / 4)}&limit=200`
      );
      const data = await response.data;
      setRiders((prevRiders) => {
        const newRiders = [...prevRiders, ...data.riders];
        const uniqueRiders = newRiders.filter(
          (rider, index, self) =>
            index === self.findIndex((t) => t.id === rider.id)
        );
        setTotalFetchedRiders(uniqueRiders.length);
        return uniqueRiders;
      });
      setTotalRiders(data.total);
    } catch (error) {
      console.error("Error fetching riders:", error);
    }
    setIsLoading(false);
  }, [currentPage]);

  useEffect(() => {
    fetchRiders();
  }, [fetchRiders]);

  const fetchPrintedRiders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/riders?page=${Math.ceil(
          currentPage / 4
        )}&limit=200&isPrinted=true`
      );
      const data = await response.data;
      setPrintedRiders((prevRiders) => {
        const newRiders = [...prevRiders, ...data.riders];
        const uniqueRiders = newRiders.filter(
          (rider, index, self) =>
            index === self.findIndex((t) => t.id === rider.id)
        );
        setTotalFetchedRiders(uniqueRiders.length);
        return uniqueRiders;
      });
      setTotalRiders(data.total);
    } catch (error) {
      console.error("Error fetching riders:", error);
    }
    setIsLoading(false);
  }, [currentPage]);

  const fetchNotPrintedRiders = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/api/riders?page=${Math.ceil(
          currentPage / 4
        )}&limit=200&isPrinted=false`
      );
      const data = await response.data;
      console.log(data);
      setNotPrintedRiders((prevRiders) => {
        const newRiders = [...prevRiders, ...data.riders];
        const uniqueRiders = newRiders.filter(
          (rider, index, self) =>
            index === self.findIndex((t) => t.id === rider.id)
        );
        setTotalFetchedRiders(uniqueRiders.length);
        return uniqueRiders;
      });

      setTotalRiders(data.total);
    } catch (error) {
      console.error("Error fetching riders:", error);
    }
    setIsLoading(false);
  }, [currentPage]);

  const addRider = async (newRider: any) => {
    try {
      await axios.post("/api/riders", newRider);
      fetchRiders();
    } catch (error) {
      console.log("Fail to add rider", error);
    }
  };

  const updateRider = async (updatedRider: Rider) => {
    await axios.put("/api/riders", updatedRider);
    // fetchRidersData();
  };

  const deleteRider = async (id: string) => {
    await axios.delete("/api/riders?id=" + id);
    fetchNotPrintedRiders();
  };

  const updatePrintedRiders = async (riders: any) => {
    try {
      const riderIds = extractIds(riders);
      await axios.put("/api/riders/updateRidersPrinted", { riderIds });
      fetchNotPrintedRiders();
    } catch (error) {
      console.log("Failed to update riders printed. Error:", error);
    }
  };

  return (
    <RiderContext.Provider
      value={{
        riders,
        printedRiders,
        notPrintedRiders,
        totalRiders,
        currentPage,
        isLoading,
        searchQuery,
        totalFetchedRiders,
        fetchRiders,
        fetchPrintedRiders,
        fetchNotPrintedRiders,
        updatePrintedRiders,
        setCurrentPage,
        setSearchQuery,
        addRider,
        updateRider,
        deleteRider,
      }}
    >
      {children}
    </RiderContext.Provider>
  );
};

// Custom Hook
export const useRiderContext = (): RiderContextState => {
  const context = useContext(RiderContext);
  if (!context) {
    throw new Error("useRiderContext must be used within a RiderProvider");
  }
  return context;
};
