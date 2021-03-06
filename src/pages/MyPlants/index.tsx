import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import { Header } from '../../components/Header';
import { loadingPlant, PlantProps } from '../../libs/storage';

import waterdrop from '../../assets/waterdrop.png';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { PlantCardSeconday } from '../../components/PlantCardSecondary';

export function MyPlants() {
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatering, setNextWatering] = useState<string>();

  async function loadStorage() {
    const plantsStoraged = await loadingPlant();

    const timeNext = formatDistance(
      new Date(plantsStoraged[0].notificationTime).getTime(),
      new Date().getTime(),
      {
        locale: pt,
      }
    );

    setNextWatering(
      `Não esqueça de regar a ${plantsStoraged[0].name} à apoximadamente ${timeNext}`
    );

    setPlants(plantsStoraged);
    setLoading(false);
  }

  useEffect(() => {
    loadStorage();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image style={styles.spotlightImage} source={waterdrop} />
        <Text style={styles.spotlightText}>{nextWatering}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantTitle}>Próximas Regadas</Text>

        <FlatList
          data={plants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PlantCardSeconday data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});
