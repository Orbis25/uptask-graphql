import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import {Input, Button, Text} from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import {gql, useMutation} from '@apollo/client';

const NEW_PROJECT = gql`
  mutation createProject($input: ProjectInput) {
    createProject(input: $input) {
      name
      id
    }
  }
`;

//for update the cache
const GET_PROJECTS = gql`
  query getAllProyects {
    getAllProyects {
      name
    }
  }
`;

const CreateProjectScreen = ({navigation}) => {
  //graphql
  const [createProject] = useMutation(NEW_PROJECT, {
    update(cache, {data: {createProject}}) {
      //for update the cache , cache, the data , name of callback
      const {getAllProyects} = cache.readQuery({query: GET_PROJECTS});
      cache.writeQuery({
        query: GET_PROJECTS,
        data: {getAllProyects: getAllProyects.concat([createProject])},
      });
    },
  });

  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeName = (text) => {
    setName(text);
  };

  const handlePress = async () => {
    if (!name.trim().length) {
      Toast.show('Ingrese un nombre valido', Toast.SHORT);
      return;
    }
    setIsLoading(true);
    try {
      const {data} = await createProject({
        variables: {
          input: {
            name: name,
          },
        },
      });
      Toast.show('Proyecto creado!', Toast.SHORT);
      navigation.navigate('home');
    } catch (error) {
      Toast.show(error.message, Toast.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} h4>
        NUEVO PROYECTO
      </Text>
      <Input
        inputStyle={styles.input}
        containerStyle={styles.containerInput}
        labelStyle={styles.labelInput}
        value={name}
        onChangeText={handleChangeName}
        placeholderTextColor="#fff"
        label="Nombre del Proyecto"
      />
      {isLoading ? (
        <ActivityIndicator color="#fff" size={30} />
      ) : (
        <Button
          onPress={handlePress}
          buttonStyle={styles.btn}
          title="CREAR PROYECTO"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    width: '90%',
  },
  btn: {
    backgroundColor: '#000',
  },
  title: {
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    color: '#fff',
    borderColor: '#fff',
    borderBottomWidth: 1,
  },
  containerInput: {
    marginBottom: 20,
    marginTop: 20,
  },
  labelInput: {
    color: '#fff',
  },
});

export default CreateProjectScreen;
