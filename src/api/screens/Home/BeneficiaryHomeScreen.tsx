import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../http"; //"../../api/http"
import { RootStackParamList } from "../../navigation/RootNavigator";

type Props = NativeStackScreenProps<RootStackParamList, "BeneficiaryHome">;

type DonationDemand = {
  id: string;
  status: string;
  notes?: string;
};

type Donation = {
  id: string;
  status: string;
};

const BeneficiaryHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { auth, logout } = useAuth();
  const beneficiaryId = auth.domainIds.beneficiaryId;
  const [demands, setDemands] = useState<DonationDemand[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    if (!beneficiaryId) return;

    const load = async () => {
      // Demandas do beneficiário
      const resDemands = await api.get<DonationDemand[]>(`/demands/beneficiary/${beneficiaryId}/`);
      setDemands(resDemands.data);

      // Donations do beneficiário – você precisa criar esse endpoint no back se ainda não existir
      try {
        const resDonations = await api.get<Donation[]>(`/donations/beneficiary/${beneficiaryId}`);
        setDonations(resDonations.data);
      } catch {
        // ignora por enquanto
      }
    };

    load();
  }, [beneficiaryId]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Olá, {auth.user?.username}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Text style={styles.link}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("CreateDemand")}
      >
        <Text style={styles.primaryButtonText}>Criar nova demanda</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Minhas demandas</Text>
      <FlatList
        data={demands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Demanda #{item.id.slice(0, 6)}</Text>
            <Text>Status: {item.status}</Text>
            {item.notes && <Text>Notas: {item.notes}</Text>}
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Minhas doações</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Doação #{item.id.slice(0, 6)}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BeneficiaryHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "600" },
  link: { color: "#2563eb", marginLeft: 8 },
  primaryButton: {
    backgroundColor: "#2563eb",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  sectionTitle: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  cardTitle: { fontWeight: "600" },
});
