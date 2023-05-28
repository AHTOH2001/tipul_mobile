import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { take_medicine, upload_photo } from '../../api/api';
import translate from '../../utils/translate';

const selectLanguage = (state) => state.root.language

export default function CameraCreen() {
  const camera = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false)
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const language = useSelector(selectLanguage)

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    requestPermission()
    return <View />;
  }
  const takeMed = (medicine) => {
    console.log('Taking med', medicine.title)
    take_medicine(medicine.id).then((resp) => {
      console.log(resp)
      if (resp.is_late) {
        Alert.alert(translate('Medicine taken, but not in time', language), medicine.title)
      } else {
        Alert.alert(translate('Medicine taken, thanks for updates', language), medicine.title)
      }
    }).catch(error => {
      console.log(error.response.data)
      if ('error' in error.response.data) {
        Alert.alert(translate('You should not take this medicine', language), medicine.title)
      } else {
        console.log(error.response)
      }
    })
  }
  const takePicture = () => {
    setIsLoading(true)
    camera.current.takePictureAsync().then((camera_picture) => {
      console.log(camera_picture)
      FileSystem.getContentUriAsync(camera_picture.uri).then(cUri => {
        console.log(cUri)
        upload_photo(cUri).then(resp => {
          if (resp.length == 0 || resp[0].score < 30) {
            Alert.alert(translate('Medicine not found :(', language), translate('Try hold your phone still', language))
          } else if (resp[0].score > 80) {
            takeMed(resp[0])
          } else {
            Alert.alert(resp[0].title, translate('Take medicine?', language), [
              {
                text: translate('take', language),
                onPress: () => {
                  takeMed(resp[0])
                },
              },
              {
                text: translate('cancel', language),
                style: 'cancel'
              },
            ]
            )
          }
          console.log('RESP', resp)
        }).finally(() => setIsLoading(false))
      })
    })
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ImageType={"png"} ratio={'16:9'} ref={camera}>
        <View style={styles.buttonContainer}>
          {isLoading ?
            <TouchableOpacity style={styles.button}>
              <ActivityIndicator size="large" color="#9E9E9E" />
            </TouchableOpacity>
            :
            <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
              <Text style={styles.text}>Take a picture</Text>
            </TouchableOpacity>
          }
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
    paddingBottom: 90
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
