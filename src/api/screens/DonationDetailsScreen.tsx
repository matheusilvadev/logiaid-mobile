import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Donation, getDonationById } from "../donations";

type RouteParams = {
  donationId: string;
};

const DonationDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { donationId } = (route.params as RouteParams) || {};
  const [donation, setDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDonationById(donationId);
        setDonation(data);
      } catch {
        setError("Erro ao carregar doação");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [donationId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!donation) {
    return (
      <View style={styles.center}>
        <Text>Doação não encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doação #{donation.id}</Text>
      <Text>Status: {donation.status}</Text>
      <Text>Demanda: {donation.demandId}</Text>
      <Text>Doador: {donation.donorId}</Text>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonSecondaryText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DonationDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
  },
  buttonSecondaryText: { color: "#374151", fontWeight: "600" },
  error: { color: "red", marginTop: 8 },
});
