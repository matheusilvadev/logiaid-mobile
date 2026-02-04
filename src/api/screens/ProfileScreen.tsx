import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../http";

const ProfileScreen: React.FC = () => {
  const { auth } = useAuth();
  const role = auth.user?.roles[0];

  const [displayName, setDisplayName] = useState(auth.user?.username ?? "");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const basePath =
    role === "BENEFICIARY"
      ? "/beneficiaries"
      : role === "DONOR"
      ? "/donors"
      : role === "TRANSPORTER"
      ? "/transporters"
      : null;

  const handleSaveDisplayName = async () => {
    if (!basePath) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.patch(`${basePath}/me/changedisplayname`, {
        newDisplayName: displayName,
      });
      setMsg("Nome atualizado");
    } catch {
      setMsg("Erro ao atualizar nome");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePhone = async () => {
    if (!basePath) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.patch(`${basePath}/me/changephone`, {
        phoneBR: { digits: phone },
      });
      setMsg("Telefone atualizado");
    } catch {
      setMsg("Erro ao atualizar telefone");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!basePath) return;
    setLoading(true);
    setMsg(null);
    try {
      await api.patch(`${basePath}/me/changeaddress`, {
        newAddress: {
          street,
          number,
          district,
          city,
          state,
        },
      });
      setMsg("Endereço atualizado");
    } catch {
      setMsg("Erro ao atualizar endereço");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text>Role: {role}</Text>
      <Text>Email: {auth.user?.email}</Text>

      {msg && <Text style={styles.msg}>{msg}</Text>}

      <Text style={styles.sectionTitle}>Nome de exibição</Text>
      <TextInput style={styles.input} value={displayName} onChangeText={setDisplayName} />
      <TouchableOpacity style={styles.button} onPress={handleSaveDisplayName} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar nome</Text>}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Telefone</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.button} onPress={handleSavePhone} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar telefone</Text>}
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Endereço</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSaveAddress} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Salvar endereço</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f9fafb" },
  title: { fontSize: 20, fontWeight: "600", marginBottom: 12 },
  msg: { marginVertical: 8 },
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
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
