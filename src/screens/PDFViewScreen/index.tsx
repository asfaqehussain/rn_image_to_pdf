import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';
import Share from 'react-native-share';

export default function PDFViewScreen(props) {
  const {navigation, route} = props;
  let finalURL = route.params.url;

  const source = {uri: 'file://' + finalURL};

  const onSharePress = () => {
    const url1 = `file:// + ${finalURL}`;

    let options = {
      type: 'application/pdf',
      url: url1, // (Platform.OS === 'android' ? 'file://' + filePath)
    };
    Share.open(options);
  };

  return (
    <View style={{flex: 1, padding: 10}}>
      <View
        style={styles.mainContainer}>
        <Text>{finalURL.split('/data')[1]}</Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={onSharePress}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Share Now</Text>
        </TouchableOpacity>
      </View>
      <Pdf
        source={source}
        style={styles.pdf}
        onError={error => {
          console.log(error);
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#D3D3D3',
  },
  mainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  buttonStyle: {
    backgroundColor: 'red',
    borderRadius: 5,
    height: 25,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
