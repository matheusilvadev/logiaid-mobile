import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { api } from "../http";

type RoleOption = "BENEFICIARY" | "DONOR" | "TRANSPORTER";

const RegisterScreen: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [document, setDocument] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [role, setRole] = useState<RoleOption>("BENEFICIARY");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleRegister = async () => {
    setMsg(null);
    setLoading(true);
    try {
  
      const body = {
        displayName,
        email,
        password,
        document,
        street,
        number,
        district,
        city,
        state,
        role, 
      };

      await api.post("/users/register", body);

      setMsg("Conta criada com sucesso. Agora faça login.");
    } catch (e: any) {
      setMsg("Erro ao registrar usuário");
    } finally {
      setLoading(false);
    }
  };

  const RoleButton = ({ value, label }: { value: RoleOption; label: string }) => (
    <TouchableOpacity
      style={[styles.roleButton, role === value && styles.roleButtonActive]}
      onPress={() => setRole(value)}
    >
      <Text style={role === value ? styles.roleButtonTextActive : styles.roleButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>

      {msg && <Text style={styles.msg}>{msg}</Text>}

      <TextInput style={styles.input} placeholder="Nome de exibição" value={displayName} onChangeText={setDisplayName} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput style={styles.input} placeholder="Documento (CPF/CNPJ)" value={document} onChangeText={setDocument} />

      <Text style={styles.sectionTitle}>Endereço</Text>
      <TextInput style={styles.input} placeholder="Rua" value={street} onChangeText={setStreet} />
      <TextInput style={styles.input} placeholder="Número" value={number} onChangeText={setNumber} />
      <TextInput style={styles.input} placeholder="Bairro" value={district} onChangeText={setDistrict} />
      <TextInput style={styles.input} placeholder="Cidade" value={city} onChangeText={setCity} />
      <TextInput
        style={styles.input}
        placeholder="UF (ex: SP)"
        value={state}
        onChangeText={(v) => setState(v.toUpperCase())}
        maxLength={2}
      />

      <Text style={styles.sectionTitle}>Tipo de usuário</Text>
      <View style={styles.roleRow}>
        <RoleButton value="BENEFICIARY" label="Beneficiário" />
        <RoleButton value="DONOR" label="Doador" />
        <RoleButton value="TRANSPORTER" label="Transportador" />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Registrar</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f9fafb" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#16a34a",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  sectionTitle: { fontWeight: "600", marginTop: 12, marginBottom: 4 },
  roleRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  roleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginHorizontal: 4,
    alignItems: "center",
  },
  roleButtonActive: { backgroundColor: "#2563eb", borderColor: "#2563eb" },
  roleButtonText: { color: "#111827" },
  roleButtonTextActive: { color: "#fff" },
  msg: { marginBottom: 8 },
});
