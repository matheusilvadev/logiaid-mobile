import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DonationDemand, getDemandById, markDemandAccepted, markDemandCanceled, markDemandFulfilled } from "../demands";

type RouteParams = {
  demandId: string;
};

const DemandDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { demandId } = (route.params as RouteParams) || {};
  const [demand, setDemand] = useState<DonationDemand | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDemandById(demandId);
        setDemand(data);
      } catch (e) {
        setError("Erro ao carregar demanda");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [demandId]);

  const handleAction = async (type: "accept" | "cancel" | "fulfilled") => {
    if (!demand) return;
    setActionLoading(true);
    setError(null);
    try {
      let updated: DonationDemand;
      if (type === "accept") {
        updated = await markDemandAccepted(demand.id);
      } else if (type === "cancel") {
        updated = await markDemandCanceled(demand.id);
      } else {
        updated = await markDemandFulfilled(demand.id);
      }
      setDemand(updated);
    } catch {
      setError("Erro ao executar ação");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!demand) {
    return (
      <View style={styles.center}>
        <Text>Demanda não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Demanda #{demand.id}</Text>
      <Text>Status: {demand.status}</Text>
      {demand.notes && <Text>Notas: {demand.notes}</Text>}

      <Text style={styles.sectionTitle}>Itens</Text>
      {demand.items && demand.items.length > 0 ? (
        demand.items.map((item) => (
          <View key={item.id ?? item.description} style={styles.itemCard}>
            <Text>{item.description}</Text>
            <Text>Qtd: {item.quantity}</Text>
            <Text>Categoria: {item.category}</Text>
          </View>
        ))
      ) : (
        <Text>Nenhum item cadastrado.</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonSecondaryText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAction("accept")}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Aceitar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#f97316" }]}
          onPress={() => handleAction("fulfilled")}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Cumprida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#ef4444" }]}
          onPress={() => handleAction("cancel")}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DemandDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  sectionTitle: { fontWeight: "600", marginTop: 16, marginBottom: 4 },
  itemCard: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#16a34a",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "30%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "30%",
    alignItems: "center",
  },
  buttonSecondaryText: { color: "#374151", fontWeight: "600", fontSize: 12 },
  error: { color: "red", marginTop: 8 },
});
