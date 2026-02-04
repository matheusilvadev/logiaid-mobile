import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../http";
;

type Donation = {
  id: string;
  status: string;
};

type TransportJob = {
  id: string;
  donationId: string;
  status: string;
};

const TransporterHomeScreen: React.FC = () => {
  const { auth, logout } = useAuth();
  const transporterId = auth.domainIds.transporterId;

  const [openDonations, setOpenDonations] = useState<Donation[]>([]);
  const [myJobs, setMyJobs] = useState<TransportJob[]>([]);

  useEffect(() => {
    const load = async () => {
   
      try {
        const resOpen = await api.get<Donation[]>("/donations/awaiting-transporter");
        setOpenDonations(resOpen.data);
      } catch {}

      if (transporterId) {

        try {
          const resJobs = await api.get<TransportJob[]>(`/transport-jobs/transporter/${transporterId}`);
          setMyJobs(resJobs.data);
        } catch {}
      }
    };
    load();
  }, [transporterId]);

  const handleAcceptDonation = async (donationId: string) => {
    const body = {
      donationId,
      transporterId,
    };
    await api.post("/transport-jobs", body);
  };

  const handleMarkInTransit = async (jobId: string) => {
    await api.patch(`/transport-jobs/${jobId}/intransit`);
  };

  const handleMarkDelivered = async (jobId: string) => {
    await api.patch(`/transport-jobs/${jobId}/delivered`);
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

      <Text style={styles.sectionTitle}>Doações aguardando transporte</Text>
      <FlatList
        data={openDonations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Doação #{item.id.slice(0, 6)}</Text>
            <Text>Status: {item.status}</Text>
            <TouchableOpacity style={styles.smallButton} onPress={() => handleAcceptDonation(item.id)}>
              <Text style={styles.smallButtonText}>Aceitar transporte</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Meus transportes</Text>
      <FlatList
        data={myJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Job #{item.id.slice(0, 6)}</Text>
            <Text>Doação: {item.donationId.slice(0, 6)}</Text>
            <Text>Status: {item.status}</Text>
            <View style={styles.row}>
              <TouchableOpacity style={styles.smallButton} onPress={() => handleMarkInTransit(item.id)}>
                <Text style={styles.smallButtonText}>Em trânsito</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.smallButton} onPress={() => handleMarkDelivered(item.id)}>
                <Text style={styles.smallButtonText}>Entregue</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TransporterHomeScreen;

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
