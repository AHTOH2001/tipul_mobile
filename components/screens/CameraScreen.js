import { Camera, CameraType } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { upload_photo } from '../../api/api';

export default function CameraCreen() {
  const camera = React.useRef(null);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    requestPermission()
    return <View />;
  }

  const takePicture = () => {
    camera.current.takePictureAsync().then((camera_picture) => {
      console.log(camera_picture)
      FileSystem.getContentUriAsync(camera_picture.uri).then(cUri => {
        console.log(cUri)
        upload_photo(cUri).then(resp => console.log(resp.data))
      })

    })
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ImageType={"png"} ratio={'16:9'} ref={camera}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => takePicture()}>
            <Text style={styles.text}>Take a picture</Text>
          </TouchableOpacity>
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
