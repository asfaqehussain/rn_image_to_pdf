import React from 'react';
import {
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import RNImageToPdf from 'react-native-image-to-pdf';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = React.useState();

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera' + '.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const generatePDF = async (uri: any) => {
    try {
      const options = {
        imagePaths: [uri?.replace('file://', '')],
        name: Platform.OS == 'android' ? 'TestPDF.pdf' : 'TestPDF',
        maxSize: { // optional maximum image dimension - larger images will be resized
          width: Dimensions.get('screen').width,
          // height: Math.round(globals.screenHeight / globals.screenWidth * 900),
      },        quality: 1, // optional compression paramter
      };
      const pdf = await RNImageToPdf.createPDFbyImages(options);

      Alert.alert('Success', 'PDF Generated. Do you want to view PDF?', [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () =>
            navigation.navigate('PDFViewScreen', {url: pdf.filePath}),
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCameraLaunch = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };
    await requestCameraPermission();

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        setSelectedImage(imageUri);
        generatePDF(imageUri);
      }
    });
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
          style={styles.buttonStyle}
          onPress={handleCameraLaunch}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Capture Image</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: 'red',
    borderRadius: 5,
    height: 45,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
  }
});