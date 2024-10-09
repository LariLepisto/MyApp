import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function App() {
  const [countries, setCountries] = useState([]); // Tilamuuttuja maita varten
  const [loading, setLoading] = useState(true); // Tilamuuttuja latauksen seuraamiseen

  useEffect(() => {
    // Funktio, joka hakee maainformaatioita REST Countries -rajapinnasta
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        // Suodatus Pohjoismaihin
        const nordicCountries = response.data.filter(country =>
          ['Finland', 'Sweden', 'Norway', 'Denmark', 'Iceland'].includes(country.name.common)
        );
        setCountries(nordicCountries); // Asetetaan suodatettu data tilamuuttujaan
        setLoading(false);
      } catch (error) {
        console.error('Virhe tietojen hakemisessa:', error);
        setLoading(false);
      }
    };

    fetchCountries(); // Kutsutaan fetchCountries-funktiota
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pohjoismaiden pinta-alat</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Latausilmoitus
      ) : (
        <FlatList
          data={countries}
          keyExtractor={(item) => item.cca3} // Käytetään maan koodia avaimena
          renderItem={({ item }) => (
            <View style={styles.countryItem}>
              <Text style={styles.countryName}>{item.name.common}</Text>
              <Text>Pinta-ala: {item.area} km²</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  countryItem: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '100%',
  },
  countryName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});