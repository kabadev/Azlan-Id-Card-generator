"use client";

import { User, UserToAdd } from "@/types/user";
import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextState {
  users: User[];
  loading: boolean;
  isSubmiting: boolean;
  addUser: (newUser: UserToAdd) => void;
  updateUser: (updatedUser: User) => void;
  deleteUser: (id: string) => void;
  fetchAllUsers: () => void;
}

// Create the Context
const UserContext = createContext<UserContextState | undefined>(undefined);

const initialUsers: User[] = [];

// Provider Component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmiting, setISubmiting] = useState<boolean>(false);

  const addUser = async (newUser: UserToAdd) => {
    try {
      setISubmiting(true);
      const res = await axios.post("/api/users", newUser);
      setUsers(res.data.users);
      setISubmiting(false);
    } catch (error) {
      console.log("Fail to add user", error);
      setISubmiting(false);
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      setISubmiting(true);
      const res = await axios.put("/api/users", updatedUser);
      setUsers(res.data.users);
      setISubmiting(false);
    } catch (error) {
      console.log("Fail to updated User", error);
      setISubmiting(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setISubmiting(true);
      const res = await axios.patch("/api/users", { id });
      setUsers(res.data.users);
      setISubmiting(false);
    } catch (error) {
      console.log("Fail to updated User", error);
      setISubmiting(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/users");
      setUsers(res.data.users);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Fail to updated User", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        users,
        loading,
        isSubmiting,
        addUser,
        updateUser,
        deleteUser,
        fetchAllUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook
export const useUserContext = (): UserContextState => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
