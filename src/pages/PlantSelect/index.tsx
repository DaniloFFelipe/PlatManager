import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';

import api from '../../service/api';

import { Header } from '../../components/Header';
import { PlantCardPrimary } from '../../components/PlantCardPrimary';
import { EnvButton } from '../../components/EnvButton';
import { Load } from '../../components/Load';

import fonts from '../../styles/fonts';
import colors from '../../styles/colors';
import { useNavigation } from '@react-navigation/core';
import { PlantProps } from '../../libs/storage';

interface EnvProps {
  key: string;
  title: string;
}

export default function PlantSelect() {
  const navigation = useNavigation();

  const [env, setEnv] = useState<EnvProps[]>();
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);
  const [envSelected, setEnvSelected] = useState('all');
  const [load, setLoad] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingAll, setLoadingAll] = useState(false);

  async function fecthEnv() {
    const { data } = await api.get(
      `plants_environments?_sort=title&_order=asc`
    );
    setEnv([
      {
        key: 'all',
        title: 'Todos',
      },
      ...data,
    ]);
  }

  async function fecthPlants() {
    const { data } = await api.get(
      `plants?_sort=name&_order=asc&_page=${page}&_limit=8`
    );

    if (!data) return setLoadingAll(true);

    if (page > 1) {
      setPlants((old) => [...old, ...data]);
      setFilteredPlants((old) => [...old, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoad(false);
    setLoadingMore(false);
  }

  function handleEnvSelected(env: string) {
    setEnvSelected(env);

    if (env === 'all') {
      setFilteredPlants(plants);
      return;
    }

    const filtered = plants.filter((p) => p.environments.includes(env));

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) return;

    setLoadingMore(true);
    setPage((old) => old + 1);
    fecthPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate('PlantSave', { plant });
  }

  useEffect(() => {
    fecthEnv();
  }, []);

  useEffect(() => {
    fecthPlants();
  }, []);

  if (load) return <Load />;

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
          renderItem={({ item }) => (
            <EnvButton
              title={item.title}
              active={item.key === envSelected}
              onPress={() => handleEnvSelected(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.envList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          contentContainerStyle={styles.plantsCard}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                style={styles.footerLoading}
                color={colors.green}
              />
            ) : (
              <></>
            )
          }
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
  plantsCard: {},
  footerLoading: {
    marginVertical: 15,
  },
});
