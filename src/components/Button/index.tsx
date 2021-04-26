import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

interface ButtonPros extends TouchableOpacityProps {
  title: string;
}

export function Button({ title, disabled, ...rest }: ButtonPros) {
  return (
    <TouchableOpacity
      style={!disabled ? styles.container : styles.containerDisable}
      disabled={disabled}
      {...rest}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.green,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerDisable: {
    backgroundColor: colors.green_light,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    color: colors.white,
    fontFamily: fonts.heading,
  },
});
