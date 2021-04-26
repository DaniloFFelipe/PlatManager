import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { SvgFromUri } from 'react-native-svg';
import { useRoute } from '@react-navigation/core';
import DataTimerPicker, { Event } from '@react-native-community/datetimepicker';

import { Button } from '../../components/Button';

import waterdrop from '../../assets/waterdrop.png';
import colors from '../../styles/colors';
import fonts from '../../styles/fonts';
import { format, isBefore } from 'date-fns';
import { PlantProps, savePlant } from '../../libs/storage';
import { useNavigation } from '@react-navigation/native';

interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const navigation = useNavigation();
  const route = useRoute();

  const { plant } = route.params as Params;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDate, setShowDate] = useState(Platform.OS == 'ios');

  function handleChangeTime(event: Event, datetime: Date | undefined) {
    if (Platform.OS === 'android') setShowDate((old) => !old);

    if (datetime && isBefore(datetime, new Date())) {
      setSelectedDate(new Date());
      return Alert.alert('Escolha uma hora no futuro! ');
    }

    if (datetime) setSelectedDate(datetime);
  }

  function handleOpenTimePickerAndroid() {
    setShowDate(!showDate);
  }

  async function handleSave() {
    try {
      await savePlant({
        ...plant,
        notificationTime: selectedDate,
      });

      navigation.navigate('Confirmation', {
        title: 'Tudo certo!',
        subtitle: `Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado`,
        buttonTitle: 'Muito Obrigado',
        icon: 'fine',
        nextScreen: 'MyPlants',
      });
    } catch {
      Alert.alert('Nao foi possivel salvar.');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.plantInfo}>
        <SvgFromUri uri={plant.photo} height={150} width={150} />

        <Text style={styles.plantName}>{plant.name}</Text>

        <Text style={styles.plantDesc}>{plant.about}</Text>
      </View>

      <View style={styles.controller}>
        <View style={styles.tipContainer}>
          <Image source={waterdrop} style={styles.tipImage} />
          <Text style={styles.tipText}>{plant.water_tips}</Text>
        </View>

        <Text style={styles.alertLabel}>
          Escolha o melhor horário para ser lembrado:
        </Text>

        {showDate && (
          <DataTimerPicker
            value={selectedDate}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}

        {Platform.OS === 'android' && (
          <View style={styles.pickerWrapper}>
            <TouchableOpacity
              style={styles.dataTimerPickerBtn}
              onPress={handleOpenTimePickerAndroid}
            >
              <Text style={styles.dataTimerPickerText}>{`Mudar ${format(
                selectedDate,
                'HH:mm'
              )}`}</Text>
            </TouchableOpacity>
          </View>
        )}

        <Button title="Cadastrar Planta" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: getBottomSpace() || 20,
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },
  plantDesc: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },
  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60,
  },
  tipImage: {
    width: 56,
    height: 56,
  },
  tipText: {
    flex: 1,
    margin: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },
  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },
  pickerWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dataTimerPickerBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dataTimerPickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
