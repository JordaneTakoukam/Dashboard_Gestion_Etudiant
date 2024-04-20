import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import {renderToString} from 'react-dom/server'

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 20,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { 
    flexDirection: 'row' 
  },
  tableCell: { 
    padding: 5, 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  },
});

const MyPDFComponent = ({ students }: { students: EtudiantType[] }) => {
  const MyDocument = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>**Liste des Étudiants**</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableCell}><Text>**Nom**</Text></View>
            <View style={styles.tableCell}><Text>**Prénom**</Text></View>
            <View style={styles.tableCell}><Text>**Date de Naissance**</Text></View>
            <View style={styles.tableCell}><Text>**Lieu de Naissance**</Text></View>
          </View>
          {students.map((student, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}><Text>{student.nom}</Text></View>
              <View style={styles.tableCell}><Text>{student.prenom}</Text></View>
              <View style={styles.tableCell}><Text>{student.date_naiss}</Text></View>
              <View style={styles.tableCell}><Text>{student.lieu_naiss}</Text></View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );

  const downloadPDF = () => {
    // const pdfContent = renderToString(<MyDocument />);
    // const blob = new Blob([pdfContent], { type: 'application/pdf' });
    // saveAs(blob, 'liste_etudiants.pdf');
    console.log(MyDocument);
  };
  downloadPDF()
  return null;
//   return (
//     <div>
//       <button onClick={downloadPDF}>Télécharger PDF</button>
//     </div>
//   );
};

export default MyPDFComponent;
