import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../http";

const CreateDemandScreen: React.FC = () => {
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleCreate = async () => {
    setLoading(true);
    setMsg(null);
    try {

      const body = {
        beneficiaryId: null,
        deliveryLocation: {
          street,
          number,
          district,
          city,
          state,
        },
        items: [],
        notes,
      };

      await api.post("/demands", body);
      setMsg("Demanda criada com sucesso");
    } catch (e) {
      setMsg("Erro ao criar demanda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova demanda</Text>

      {msg && <Text style={styles.msg}>{msg}</Text>}

      <Text style={styles.sectionTitle}>Local de entrega</Text>
      <TextInput style={styles.input} placeholder="Rua" value={street} onChangeText={setStreet} />
      <TextInput style={styles.input} placeholder="Número" value={number} onChangeText={setNumber} />
      <TextInput style={styles.input} placeholder="Bairro" value={district} onChangeText={setDistrict} />
      <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
      <TextInput
        style={styles.input}
        placeholder="UF"
        value={state}
        onChangeText={(v) => setState(v.toUpperCase())}
        maxLength={2}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notas"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default CreateDemandScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  sectionTitle: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  msg: { marginBottom: 8 },
});
