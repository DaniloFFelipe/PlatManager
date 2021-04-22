import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import { Header } from '../../components/Header';

import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { EnvButton } from '../../components/EnvButton';
import api from '../../service/api';
import { PlantCardPrimary } from '../../components/PlantCardPrimary';

interface EnvProps {
  key: string;
  title: string;
}

interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: string;
    repeat_every: string;
  };
}

export default function PlantSelect() {
  const [env, setEnv] = useState<EnvProps[]>();
  const [plants, setPlants] = useState<PlantProps[]>();

  useEffect(() => {
    async function fecthEnv() {
      const { data } = await api.get('plants_environments');
      setEnv([
        {
          key: 'all',
          title: 'Todos',
        },
        ...data,
      ]);
    }

    fecthEnv();
  }, []);

  useEffect(() => {
    async function fecthPlants() {
      const { data } = await api.get('plants');
      setPlants(data);
    }

    fecthPlants();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente </Text>
        <Text style={styles.subtitile}>você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={env}
          renderItem={({ item }) => <EnvButton title={item.title} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.envList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={plants}
          renderItem={({ item }) => <PlantCardPrimary data={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitile: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  envList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
});
