import React from "react";
import { StatusBar } from "react-native";
import { AuthProvider } from "./src/api/context/AuthContext"; //import { AuthProvider } from "../src/context/AuthContext";
import RootNavigator from "./src/api/navigation/RootNavigator"; // import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <AuthProvider>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </AuthProvider>
  );
}