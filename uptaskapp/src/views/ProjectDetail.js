import React, {useState} from 'react';
import {View, StyleSheet, ActivityIndicator, FlatList} from 'react-native';
import {Text, ListItem, Icon, Button, Input} from 'react-native-elements';
import {gql, useMutation, useQuery} from '@apollo/client';
import Toast from 'react-native-simple-toast';

const NEW_TASK = gql`
  mutation createTask($input: TaskInput) {
    createTask(input: $input) {
      id
      name
      state
      projectId
    }
  }
`;

const GET_TASKS = gql`
  query getAllTasks($input: ProjectIDInput) {
    getAllTasks(input: $input) {
      id
      name
      state
      projectId
    }
  }
`;

const REMOVE_TASK = gql`
  mutation removeTask($input: ID!) {
    removeTask(id: $input)
  }
`;

const UPDATE_TASK = gql`
  mutation updateTask($input: ID!) {
    updateTask(id: $input) {
      id
      name
      state
      projectId
    }
  }
`;

const ProjectDetail = ({route}) => {
  const {params} = route;

  //state
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreate, setIsCreate] = useState(false);

  //apollo
  const [createTask] = useMutation(NEW_TASK, {
    update(cache, {data: {createTask}}) {
      const {getAllTasks} = cache.readQuery({
        query: GET_TASKS,
        variables: {
          input: {
            id: params.id,
          },
        },
      });

      cache.writeQuery({
        query: GET_TASKS,
        variables: {
          input: {
            id: params.id,
          },
        },
        data: {
          getAllTasks: [...getAllTasks, createTask],
        },
      });
    },
  });
  const {data, loading, error} = useQuery(GET_TASKS, {
    variables: {
      input: {
        id: params.id,
      },
    },
  });

  const [updateTask] = useMutation(UPDATE_TASK);

  const handleChange = (text) => {
    setTitle(text);
  };

  const handleCreate = async () => {
    if (!title.trim().length) {
      Toast.show('Coloque un nombre para la tarea');
      return;
    }

    setIsLoading(true);

    try {
      const {data} = await createTask({
        variables: {
          input: {
            name: title,
            projectId: params.id,
          },
        },
      });
      Toast.show('Creado correctamente!');
    } catch (error) {
      Toast.show(error.message);
    } finally {
      setIsLoading(false);
      setIsCreate(false);
    }
  };

  if (loading) {
    return (
      <View style={{marginTop: 20}}>
        <ActivityIndicator size={40} color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{marginTop: 20}}>
        <Text style={{textAlign: 'center', color: '#fff'}} h1>
          {error.message}
        </Text>
      </View>
    );
  }

  const TaskItem = ({task}) => {
    const [removeTask] = useMutation(REMOVE_TASK, {
      update(cache) {
        const {getAllTasks} = cache.readQuery({
          query: GET_TASKS,
          variables: {
            input: {
              id: params.id,
            },
          },
        });

        cache.writeQuery({
          query: GET_TASKS,
          variables: {
            input: {
              id: params.id,
            },
          },
          data: {
            getAllTasks: getAllTasks.filter(
              (actualTask) => actualTask.id !== task.id,
            ),
          },
        });
      },
    });

    const handleRemove = async () => {
      try {
        await removeTask({
          variables: {
            input: task.id,
          },
        });
        Toast.show('Eliminada');
      } catch (error) {
        Toast.show(error.message);
      }
    };

    const handleUpdate = async () => {
      try {
        const result = await updateTask({
          variables: {
            input: task.id,
          },
        });
        console.log(result);
        Toast.show('updated');
      } catch (error) {
        Toast.show(error.message);
      }
    };

    return (
      <>
        <ListItem bottomDivider style={{marginBottom: 5}}>
          <ListItem.Content>
            <ListItem.Title>{task.name}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            onPress={handleRemove}
            name="delete"
            color="#D32F2F"
          />
          <Icon
            type="material-community"
            onPress={handleUpdate}
            onC
            name="check"
            color={task.state ? '#28d615' : ''}
          />
        </ListItem>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {isCreate ? (
        <>
          <Input
            inputStyle={styles.input}
            labelStyle={styles.labelInput}
            onChangeText={handleChange}
            label="Nombre de la tarea"
          />
          {isLoading ? (
            <ActivityIndicator size={40} color="#fff" />
          ) : (
            <Button
              onPress={handleCreate}
              buttonStyle={styles.btn}
              title="Crear tarea"
            />
          )}
        </>
      ) : (
        <Button
          onPress={() => setIsCreate(true)}
          buttonStyle={styles.btn}
          title="Nueva tarea"
        />
      )}

      <View style={{marginTop: 10}}>
        <Text style={{marginBottom: 10, color: '#fff'}}>Tareas</Text>
        <FlatList
          data={data.getAllTasks}
          renderItem={({item}) => <TaskItem task={item} />}
          keyExtractor={(item, _) => item.id.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
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
  btn: {
    backgroundColor: '#000',
  },
});

export default ProjectDetail;
