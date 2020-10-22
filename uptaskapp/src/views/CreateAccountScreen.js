import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Button, Input, Text} from 'react-native-elements';
import Toast from 'react-native-simple-toast';

//apollo
import {gql, useMutation} from '@apollo/client';

const NEW_USER = gql`
  mutation createUser($input: UserInput) {
    createUser(input: $input)
  }
`;

import styles from '../styles';

const CreateForm = ({navigation}) => {
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  //apollo mutation
  //createUser is a fucntion to call
  const [createUser] = useMutation(NEW_USER);

  const handleGoNewAccount = () => {
    navigation.navigate('login');
  };

  const handleChangeName = (value) => {
    setName(value);
  };
  const handleChangeUserName = (value) => {
    setUserName(value);
  };
  const handleChangePassword = (value) => {
    setPassword(value);
  };

  const handleRegister = async () => {
    if (!name.length || !userName.length || !password.length) {
      Toast.show('Todos los campos son requeridos', Toast.SHORT);
      return;
    }

    try {
      const {data} = await createUser({
        variables: {
          input: {
            name: name,
            email: userName,
            password: password,
          },
        },
      });

      if (!!data.createUser) {
        Toast.show(data.createUser, Toast.SHORT);
        navigation.navigate('login');
      }
    } catch (error) {
      Toast.show(error.message, Toast.SHORT);
    }
  };

  return (
    <View style={styles.formContainer}>
      <ScrollView>
        <View>
          <Text h1 style={styles.titleApp}>
            UpTask
          </Text>
          <Text style={styles.titleApp}>Nueva cuenta</Text>
        </View>
        <View>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.inputLabel}
            onChangeText={handleChangeName}
            label="Nombre"
          />
        </View>
        <View>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.inputLabel}
            onChangeText={handleChangeUserName}
            label="Usuario"
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
        <View>
          <Button
            onPress={handleRegister}
            buttonStyle={styles.btnLogin}
            title="Crear cuenta"
          />
          <Button
            onPress={handleGoNewAccount}
            titleStyle={styles.titleBtnNewAccount}
            title="Iniciar sesión"
            type="clear"></Button>
        </View>
      </ScrollView>
    </View>
  );
};

const CreateAccountScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <CreateForm navigation={navigation} />
    </View>
  );
};

export default CreateAccountScreen;
