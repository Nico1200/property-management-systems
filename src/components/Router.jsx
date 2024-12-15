/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import Tenants from "./Tenants";
import { initialDatabase } from "./init";
import Units from "./Units";
import Property from "./Property";
import Receipts from "./Receipts";

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHb1afM2QWVqvYTHUCgYCZr3J0MxNFRAk",
  authDomain: "property-management-syst-256e3.firebaseapp.com",
  projectId: "property-management-syst-256e3",
  storageBucket: "property-management-syst-256e3.firebasestorage.app",
  messagingSenderId: "108308977844",
  appId: "1:108308977844:web:9bb451bd01a26359949fe1",
  measurementId: "G-L5ED4QQ4JW",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore(firebaseApp);

const Router = () => {
  const [database, setDatabase] = useState(() => {
    const saved = localStorage.getItem("tenant_database");
    return saved ? JSON.parse(saved) : initialDatabase;
  });

  const [modalContent, setModalContent] = useState(null);

  // Save database to Firestore
  const saveDatabaseToFirestore = async (newDatabase) => {
    try {
      const dbRef = doc(firestore, "databases", "tenant_database");
      await setDoc(dbRef, newDatabase);
      console.log("Database saved to Firestore.");
    } catch (error) {
      console.error("Error saving database to Firestore:", error);
    }
  };

  // Load database from Firestore
  const loadDatabaseFromFirestore = async () => {
    try {
      const dbRef = doc(firestore, "databases", "tenant_database");
      const dbSnap = await getDoc(dbRef);

      if (dbSnap.exists()) {
        const data = dbSnap.data();
        localStorage.setItem("tenant_database", JSON.stringify(data));
        setDatabase(data);
        console.log("Database loaded from Firestore.");
      } else {
        console.log("No database found in Firestore, using initial database.");
      }
    } catch (error) {
      console.error("Error loading database from Firestore:", error);
    }
  };

  // add data to local strorage if db changes
  useEffect(() => {
    localStorage.setItem("tenant_database", JSON.stringify(database));
  }, [database]);

  const saveDatabaseToLocalStorage = (newDatabase) => {
    setDatabase(newDatabase);
    localStorage.setItem("tenant_database", JSON.stringify(newDatabase));
    saveDatabaseToFirestore(newDatabase);
  };

  const closeModal = () => setModalContent(null);

  useEffect(() => {
    // Sync with Firestore when the component mounts
    loadDatabaseFromFirestore();
  }, []);

  // Add monthly rent debt calculation function
  function calculateMonthlyRent(tenant, database) {
    // Only calculate for active tenants with assigned units
    if (tenant.status === "active" && tenant.unit) {
      const property = database.properties.find(
        (p) => p.location === tenant.location
      );
      if (!property) return;

      const unit = property.units.find((u) => u.unit === tenant.unit);
      if (!unit) return;

      // Get the current date and tenant's last payment date
      const currentDate = new Date();
      const lastPayDate = tenant.lastPayDate
        ? new Date(tenant.lastPayDate)
        : new Date(tenant.startDate);

      // Calculate months difference
      const monthsDiff =
        (currentDate.getFullYear() - lastPayDate.getFullYear()) * 12 +
        (currentDate.getMonth() - lastPayDate.getMonth());

      // If at least one month has passed since last payment
      if (monthsDiff >= 1) {
        if (tenant.prepaidMonths > 0) {
          const monthsToDeduct = Math.min(
            tenant.prepaidMonths,
            Math.floor(monthsDiff)
          );
          tenant.prepaidMonths -= monthsToDeduct;

          const remainingMonths = Math.floor(monthsDiff) - monthsToDeduct;
          if (remainingMonths > 0) {
            tenant.balance += unit.price * remainingMonths;
            database.financials.totalDebts += unit.price * remainingMonths;
          }
        } else {
          tenant.balance += unit.price * Math.floor(monthsDiff);
          database.financials.totalDebts += unit.price * Math.floor(monthsDiff);
        }

        // Add monthly rent to balance
        // tenant.balance += unit.price * Math.floor(monthsDiff);
        // Update financials
        // database.financials.totalDebts += unit.price * Math.floor(monthsDiff);
        // Update last pay date to current month (but keep the same day)
        const newLastPayDate = new Date(lastPayDate);
        newLastPayDate.setMonth(
          newLastPayDate.getMonth() + Math.floor(monthsDiff)
        );
        tenant.lastPayDate = newLastPayDate.toISOString();
      }
    }
  }

  // Add effect to check monthly rent
  useEffect(() => {
    const checkMonthlyRent = () => {
      const newDatabase = { ...database };
      newDatabase.tenants.forEach((tenant) => {
        calculateMonthlyRent(tenant, newDatabase);
      });
      saveDatabaseToLocalStorage(newDatabase);
    };

    // Check immediately when component mounts
    checkMonthlyRent();

    // Set up interval to check daily
    const interval = setInterval(checkMonthlyRent, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            modalContent={modalContent}
            setModalContent={setModalContent}
            setDatabase={setDatabase}
          />
        }
      >
        <Route index element={<Dashboard database={database} />} />
        <Route
          path="tenants"
          element={
            <Tenants
              database={database}
              setDatabase={saveDatabaseToLocalStorage}
              setModalContent={setModalContent}
            />
          }
        />
        <Route
          path="units"
          element={
            <Units
              database={database}
              setDatabase={saveDatabaseToLocalStorage}
              setModalContent={setModalContent}
            />
          }
        />
        <Route
          path="property"
          element={
            <Property
              database={database}
              setDatabase={saveDatabaseToLocalStorage}
              setModalContent={setModalContent}
            />
          }
        />
        <Route
          path="receipts"
          element={
            <Receipts
              database={database}
              setDatabase={saveDatabaseToLocalStorage}
              setModalContent={setModalContent}
            />
          }
        />
      </Route>
    </Routes>
  );
};

export default Router;
