import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useAuth } from "../context/AuthContext";
import CreateDemandScreen from "../screens/CreateDemandScreen";
import BeneficiaryHomeScreen from "../screens/Home/BeneficiaryHomeScreen";
import DonorHomeScreen from "../screens/Home/DonorHomeScreen";
import TransporterHomeScreen from "../screens/Home/TransporterHomeScreen";
import LoginScreen from "../screens/LoginScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  BeneficiaryHome: undefined;
  DonorHome: undefined;
  TransporterHome: undefined;
  Profile: undefined;
  CreateDemand: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { auth, primaryRole, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  const isLoggedIn = !!auth.tokens;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Registrar" }} />
          </>
        ) : (
          <>
            {primaryRole === "BENEFICIARY" && (
              <Stack.Screen
                name="BeneficiaryHome"
                component={BeneficiaryHomeScreen}
                options={{ title: "Minhas demandas" }}
              />
            )}
            {primaryRole === "DONOR" && (
              <Stack.Screen
                name="DonorHome"
                component={DonorHomeScreen}
                options={{ title: "Demandas para doar" }}
              />
            )}
            {primaryRole === "TRANSPORTER" && (
              <Stack.Screen
                name="TransporterHome"
                component={TransporterHomeScreen}
                options={{ title: "Transportes" }}
              />
            )}
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
            <Stack.Screen name="CreateDemand" component={CreateDemandScreen} options={{ title: "Criar demanda" }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
