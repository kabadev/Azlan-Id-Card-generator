"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
export interface Rider {
  id: string;
  surname: string;
  firstName: string;
  middleName?: string;
  sex: string;
  district: string;
  city: string;
  dateOfBirth: string;
  park: string;
  RIN: string;
  photo: string;
}

// Context State Type
interface RiderContextState {
  riders: Rider[];
  addRider: (newRider: Rider) => void;
  updateRider: (updatedRider: Rider) => void;
  deleteRider: (id: string) => void;
}

// Create the Context
const RiderContext = createContext<RiderContextState | undefined>(undefined);

// Initial Riders (Mock Data)
const initialRiders: Rider[] = [
  {
    id: "CBR-KA-001",
    surname: "Sangare",
    firstName: "Mariama",
    middleName: "",
    sex: "Female",
    district: "Koinadugu",
    city: "Kabala",
    dateOfBirth: "1990-05-10",
    park: "Kabala Central",
    RIN: "RIN001",
    photo: "/profile.png",
  },
  {
    id: "CBR-KA-002",
    surname: "Kamara",
    firstName: "Abu",
    middleName: "Khalifa",
    sex: "Male",
    district: "Koinadugu",
    city: "Kabala",
    dateOfBirth: "1993-08-15",
    park: "Kabala Central",
    RIN: "RIN002",
    photo: "/moba.jpg",
  },
  {
    id: "CBR-BO-001",
    surname: "Jalloh",
    firstName: "Abdul",
    middleName: "Rahman",
    sex: "Male",
    district: "Bo",
    city: "Bo City",
    dateOfBirth: "1992-11-05",
    park: "Bo Central",
    RIN: "RIN003",
    photo: "isatu.jpg",
  },
];

// Provider Component
export const RiderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [riders, setRiders] = useState<Rider[]>(initialRiders);

  const addRider = (newRider: any) => {
    setRiders((prevRiders) => [...prevRiders, newRider]);
  };

  const updateRider = (updatedRider: Rider) => {
    setRiders((prevRiders) =>
      prevRiders.map((rider) =>
        rider.id === updatedRider.id ? updatedRider : rider
      )
    );
  };

  const deleteRider = (id: string) => {
    setRiders((prevRiders) => prevRiders.filter((rider) => rider.id !== id));
  };

  return (
    <RiderContext.Provider
      value={{ riders, addRider, updateRider, deleteRider }}
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
