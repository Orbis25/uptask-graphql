import React from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';

import styles from '../styles';

const AuthForm = ({navigation}) => {
  const handleGoNewAccount = () => {
    navigation.navigate('CreateAccount');
  };
  return (
    <View style={styles.formContainer}>
      <ScrollView>
        <View>
          <Text h1 style={styles.titleApp}>
            UpTask
          </Text>
        </View>
        <View>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.inputLabel}
            label="Usuario"
          />
        </View>
        <View>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.inputLabel}
            secureTextEntry
            label="Contraseña"
          />
        </View>
        <View>
          <Button buttonStyle={styles.btnLogin} title="Entrar" />
          <Button
            onPress={handleGoNewAccount}
            titleStyle={styles.titleBtnNewAccount}
            title="Crear cuenta"
            type="clear"></Button>
        </View>
      </ScrollView>
    </View>
  );
};

const LoginScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <AuthForm navigation={navigation} />
    </View>
  );
};

export default LoginScreen;
