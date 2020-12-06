import React from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {Button, ListItem, Text} from 'react-native-elements';

import {gql, useQuery} from '@apollo/client';

const GET_PROJECTS = gql`
  query getAllProyects {
    getAllProyects {
      name
      id
    }
  }
`;

const HomeScreen = ({navigation}) => {
  const {data, loading, error} = useQuery(GET_PROJECTS);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="#fff" size={40} />
        <Text style={styles.title}>Cargando...</Text>
      </View>
    );
  }

  const handlePressGoNewProject = () => {
    navigation.navigate('newProject');
  };

  const Item = ({project, navigation}) => {
    const handleGoDetail = () => {
      navigation.navigate('ProjectDetail', project);
    };

    return (
      <>
        <ListItem onPress={handleGoDetail} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{project.name}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Button
        titleStyle={styles.titleBtn}
        buttonStyle={styles.btnNew}
        title="Nuevo Proyecto"
        onPress={handlePressGoNewProject}
      />
      <Text style={styles.title} h4>
        Selecciona un proyecto
      </Text>
      <View style={styles.listContainer}>
        <FlatList
          data={data.getAllProyects}
          renderItem={({item}) => (
            <Item project={item} navigation={navigation} />
          )}
          keyExtractor={(item, _) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  btnNew: {
    backgroundColor: '#000',
  },
  titleBtn: {
    textAlign: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
});

export default HomeScreen;
