import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';

import avatar from '../../assets/avatar.png';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export function Header() {
  const [name, setName] = useState<string>();

  async function getName() {
    const userName = await AsyncStorage.getItem('@plantmanegar:user');
    setName(userName || '');
  }

  useEffect(() => {
    getName();
  }, [name]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.userName}>{name}</Text>
      </View>

      <Image source={avatar} style={styles.img} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    fontFamily: fonts.text,
    color: colors.heading,
  },
  userName: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  img: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
});
