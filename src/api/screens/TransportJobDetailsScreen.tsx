import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  TransportJob,
  getTransportJobById,
  markTransportJobDelivered,
  markTransportJobInTransit,
} from "../transportJobs";

type RouteParams = {
  jobId: string;
};

const TransportJobDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { jobId } = (route.params as RouteParams) || {};
  const [job, setJob] = useState<TransportJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTransportJobById(jobId);
        setJob(data);
      } catch {
        setError("Erro ao carregar transporte");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [jobId]);

  const handleInTransit = async () => {
    if (!job) return;
    setActionLoading(true);
    setError(null);
    try {
      const updated = await markTransportJobInTransit(job.id);
      setJob(updated);
    } catch {
      setError("Erro ao marcar como em trânsito");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelivered = async () => {
    if (!job) return;
    setActionLoading(true);
    setError(null);
    try {
      const updated = await markTransportJobDelivered(job.id);
      setJob(updated);
    } catch {
      setError("Erro ao marcar como entregue");
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

  if (!job) {
    return (
      <View style={styles.center}>
        <Text>Transporte não encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transporte #{job.id}</Text>
      <Text>Doação: {job.donationId}</Text>
      <Text>Transportador: {job.transporterId}</Text>
      <Text>Status: {job.status}</Text>

      {job.assignedAt && <Text>Designado em: {job.assignedAt}</Text>}
      {job.pickedUpAt && <Text>Retirado em: {job.pickedUpAt}</Text>}
      {job.deliveredAt && <Text>Entregue em: {job.deliveredAt}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonSecondaryText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleInTransit}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Em trânsito</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#16a34a" }]}
          onPress={handleDelivered}
          disabled={actionLoading}
        >
          <Text style={styles.buttonText}>Entregue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransportJobDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 8 },
  actionsRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    minWidth: "30%",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 12 },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#6b7280",
    padding: 10,
    borderRadius: 8,
    minWidth: "30%",
    alignItems: "center",
  },
  buttonSecondaryText: { color: "#374151", fontWeight: "600", fontSize: 12 },
  error: { color: "red", marginTop: 8 },
});
