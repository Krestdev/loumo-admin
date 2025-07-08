// components/pdf/OrdersPDFDocument.tsx

"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  //Font
} from "@react-pdf/renderer";
import { Order } from "@/types/types";
import { format } from "date-fns";
import { XAF } from "@/lib/utils";

// Optional: custom font (if needed)
// Font.register({ family: "Roboto", src: "/fonts/Roboto-Regular.ttf" });

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 12,
  },
  header: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    fontWeight: "bold",
    paddingVertical: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 2,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
});

type Props = {
  orders: Order[];
};

const getStatusLabel = (status: Order["status"]) => {
  const labels: Record<Order["status"], string> = {
    FAILED: "Échouée",
    COMPLETED: "Terminée",
    PROCESSING: "En traitement",
    REJECTED: "Rejetée",
    ACCEPTED: "Acceptée",
    PENDING: "En attente",
  };
  return labels[status] ?? status;
};

export const OrdersPDFDocument = ({ orders }: Props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Liste des commandes</Text>

      <View style={styles.tableHeader}>
        <Text style={styles.cell}>ID</Text>
        <Text style={styles.cell}>Client</Text>
        <Text style={styles.cell}>Date</Text>
        <Text style={styles.cell}>Montant</Text>
        <Text style={styles.cell}>Statut</Text>
      </View>

      {orders.map((order) => (
        <View style={styles.tableRow} key={order.id}>
          <Text style={styles.cell}>{order.id}</Text>
          <Text style={styles.cell}>{order.user.name}</Text>
          <Text style={styles.cell}>
            {format(new Date(order.createdAt), "dd/MM/yyyy HH:mm")}
          </Text>
          <Text style={styles.cell}>
            {XAF.format(order.total + order.deliveryFee)}
          </Text>
          <Text style={styles.cell}>{getStatusLabel(order.status)}</Text>
        </View>
      ))}
    </Page>
  </Document>
);
