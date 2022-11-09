import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, TouchableOpacity, Text, Alert, TouchableNativeFeedback } from 'react-native';
import { ListItem, Button, Icon } from 'react-native-elements'
import firestore, { db } from '../../firebase/firebaseDb';
import { connect } from 'react-redux'

class TrainingScreen extends Component {

  constructor() {
    super();
    this.firestoreRef = firestore.collection(db, 'trainings');
    this.state = {
      isLoading: true,
      trainingArr: []
    };
  }

  componentDidMount() {
    this.unsubscribe = firestore.onSnapshot(this.firestoreRef, this.getCollection)
    this.props.navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => this.props.navigation.navigate('SettingsScreen')}
          color="#fff"
          type='clear'
          icon={{
            name: "settings",
            color: 'white',
          }}
        />
      ),
    })
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  getCollection = (querySnapshot) => {
    const trainingArr = [];
    querySnapshot.forEach((res) => {
      const { name, color } = res.data();
      trainingArr.push({
        key: res.id,
        res,
        name,
        color,
      });
    });
    this.setState({
      trainingArr,
      isLoading: false,
    });
  }

  resolve_back_color = () => {
    return this.props.root.theme == 'dark' ? '#151614' : 'white'
  }
  resolve_front_color = () => {
    return this.props.root.theme == 'dark' ? 'white' : '#151614'
  }

  resolve_font_size = (original_size) => {
    return Math.round(this.props.root.font_size / 20 * original_size)
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ ...styles.preloader, backgroundColor: this.resolve_back_color() }}>
          <ActivityIndicator size="large" color="#9E9E9E" />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => this.props.navigation.navigate('AddTrainingScreen')}
          >
            <Text style={{ fontSize: 25, color: this.resolve_back_color() }}>+</Text>
          </TouchableOpacity>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView style={{ backgroundColor: this.resolve_back_color() }}>
          {
            this.state.trainingArr.map((item, i) => {
              return (
                <ListItem key={i}
                  bottomDivider
                  containerStyle={{ backgroundColor: item.color, borderRadius: 20, margin: 10 }}
                  // onShowUnderlay={() => console.log('Underlay')}
                  // onHideUnderlay={() => console.log('Hode Underlay')}
                  onLongPress={() => Alert.alert('Training ' + item.name, null,
                    [
                      {
                        text: 'modify',
                        onPress: () => this.props.navigation.navigate('TrainingDetailScreen', { trainingkey: item.key }),
                        style: 'default'
                      },
                      {
                        text: 'delete',
                        onPress: () => {
                          const dbRef = firestore.doc(firestore.collection(db, 'trainings'), item.key)
                          firestore.deleteDoc(dbRef).then((res) => {
                            console.log('Item removed from database')
                            this.props.navigation.navigate('TrainingScreen');
                          })
                        },
                        style: 'destructive'
                      },
                      {
                        text: 'cancel',
                        style: 'cancel'
                      },
                    ])}
                  onPress={() => this.props.navigation.navigate('ActionScreen', { trainingkey: item.key })}
                >
                  <ListItem.Content>
                    <ListItem.Title style={{ color: this.resolve_back_color(), fontSize: this.resolve_font_size(20), paddingLeft: 20 }}>{item.name}</ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              );
            })
          }
        </ScrollView>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => this.props.navigation.navigate('AddTrainingScreen')}
        >
          <Icon name='plus' type='antdesign' color={this.resolve_back_color()} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 70,
    backgroundColor: 'green',
    borderRadius: 100
  }
})

const mapStateToProps = state => {
  return {
    root: state.root
  }
}

export default connect(mapStateToProps)(TrainingScreen)