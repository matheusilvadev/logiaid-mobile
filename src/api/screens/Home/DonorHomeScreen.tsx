import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../http";
;

type DonationDemand = {
  id: string;
  status: string;
  notes?: string;
};

type Donation = {
  id: string;
  status: string;
};

const DonorHomeScreen: React.FC = () => {
  const { auth, logout } = useAuth();
  const donorId = auth.domainIds.donorId;
  const [availableDemands, setAvailableDemands] = useState<DonationDemand[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const load = async () => {
      // TODO: criar endpoint pra listar demandas abertas pra doadores
      try {
        const resDemands = await api.get<DonationDemand[]>("/demands"); // hoje só ADMIN, mas a ideia seria filtrar abertas
        setAvailableDemands(resDemands.data);
      } catch {}

      if (donorId) {
        const resDonations = await api.get<Donation[]>(`/donations/donor/${donorId}`);
        setMyDonations(resDonations.data);
      }
    };
    load();
  }, [donorId]);

  const handleAcceptDemand = async (demandId: string) => {
    // DONOR aceita demanda → /demands/{id}/accepted (PatchMapping com hasRole('DONOR'))
    await api.patch(`/demands/${demandId}/accepted`);
    // opcional: recarregar lista
  };

  const handleCreateDonationFromDemand = async (demandId: string) => {
    // Chama CreateDonationRequest no DonationController
    // Aqui simplifico o endereço, mas você pode abrir tela separada pra preencher
    const body = {
      demandId,
      street: "Rua do Doador",
      number: "123",
      district: "Centro",
      city: "São Paulo",
      state: "SP",
    };
    await api.post("/donations", body);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Olá, {auth.user?.username}</Text>
        <TouchableOpacity>
          <Text style={styles.link}>Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Demandas aguardando doador</Text>
      <FlatList
        data={availableDemands}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Demanda #{item.id.slice(0, 6)}</Text>
            <Text>Status: {item.status}</Text>
            {item.notes && <Text>Notas: {item.notes}</Text>}

            <View style={styles.row}>
              <TouchableOpacity style={styles.smallButton} onPress={() => handleAcceptDemand(item.id)}>
                <Text style={styles.smallButtonText}>Aceitar demanda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => handleCreateDonationFromDemand(item.id)}>
                <Text style={styles.smallButtonText}>Criar doação</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Minhas doações</Text>
      <FlatList
        data={myDonations}
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

export default DonorHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f3f4f6" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 20, fontWeight: "600" },
  link: { color: "#2563eb" },
  sectionTitle: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 8 },
  cardTitle: { fontWeight: "600" },
  row: { flexDirection: "row", marginTop: 8 },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2563eb",
    marginRight: 8,
  },
  smallButtonText: { color: "#2563eb", fontSize: 12 },
});
