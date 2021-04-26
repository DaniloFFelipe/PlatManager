import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Button } from '../../components/Button';

import colors from '../../styles/colors';
import fonts from '../../styles/fonts';

export function UserEntry() {
  const navigation = useNavigation();

  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const [name, setName] = useState<string>();

  async function handleSubmit() {
    if (!name) return Alert.alert('Me diz como posso te chamar.');

    try {
      await AsyncStorage.setItem('@plantmanegar:user', name);

      navigation.navigate('Confirmation', {
        title: 'Prontinho',
        subtitle: `Vamos começar a cuidar da suas \n platinhas com muito ciudado.`,
        buttonTitle: 'Começar',
        icon: 'smile',
        nextScreen: 'PlantSelect',
      });
    } catch {
      Alert.alert('Internal Error!!');
    }
  }

  function handleInputBlur() {
    setIsFocused(false);
  }

  function handleInputFocus() {
    setIsFocused(true);
  }

  function handleInputChange(value: string) {
    setIsFilled(!!value);
    setName(value);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.form}>
              <View style={styles.formHeader}>
                <Text style={styles.emoji}>{!name ? '😊' : '😃'}</Text>

                <Text style={styles.title}>
                  Como podemos {'\n'} chamar você?
                </Text>
              </View>

              <TextInput
                style={[
                  styles.input,
                  (isFocused || isFilled) && { borderColor: colors.green },
                ]}
                placeholder="Digite um nome"
                onBlur={handleInputBlur}
                onFocus={handleInputFocus}
                onChangeText={handleInputChange}
              />

              <View style={styles.footer}>
                <Button
                  title="Confirmar"
                  onPress={handleSubmit}
                  disabled={!name}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 54,
  },
  formHeader: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 44,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.gray,
    color: colors.heading,
    width: '100%',
    fontSize: 18,
    marginTop: 50,
    padding: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'center',
    color: colors.heading,
    fontFamily: fonts.heading,
    marginTop: 20,
  },
  footer: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 20,
  },
});
