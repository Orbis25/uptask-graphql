import React, {useState} from 'react';
import {ScrollView, View, ActivityIndicator} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import {gql, useMutation} from '@apollo/client';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_AUTH_TOKEN} from '../consts/asyncStorage';

import styles from '../styles';

//mutation
const AUTH_USER = gql`
  mutation autenticateUser($input: AuthInput) {
    autenticateUser(input: $input) {
      token
    }
  }
`;

const AuthForm = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * return the name of mutation (autenticateUser)
   */
  const [autenticateUser] = useMutation(AUTH_USER);

  const handleSubmit = async () => {
    await AsyncStorage.removeItem(USER_AUTH_TOKEN);

    const authInput = {email, password};

    if (!email.length || !password.length) {
      Toast.show('Todos los campos son requeridos', Toast.SHORT);
      return;
    }
    setIsLoading(true);

    try {
      const {data} = await autenticateUser({
        variables: {
          input: authInput,
        },
      });

      const {token} = data.autenticateUser;
      await AsyncStorage.setItem(USER_AUTH_TOKEN, token);
      navigation.navigate('home');
    } catch (error) {
      Toast.show(error.message, Toast.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = (text) => {
    setPassword(text);
  };

  const handleChangeUser = (text) => {
    setEmail(text.toLowerCase());
  };

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
            onChangeText={handleChangeUser}
          />
        </View>
        <View>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.inputLabel}
            onChangeText={handleChangePassword}
            secureTextEntry
            label="Contraseña"
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size={30} color="#ffffff" />
        ) : (
          <View>
            <Button
              buttonStyle={styles.btnLogin}
              onPress={handleSubmit}
              title="Entrar"
            />
            <Button
              onPress={handleGoNewAccount}
              titleStyle={styles.titleBtnNewAccount}
              title="Crear cuenta"
              type="clear"></Button>
          </View>
        )}
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
