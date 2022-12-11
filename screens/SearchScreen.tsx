import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import {Button, Text, ListItem} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import Spinner from 'react-native-loading-spinner-overlay';
const SearchScreen: React.FC<{navigation: any}> = ({navigation}) => {
  const [isLoading, setisLoading] = useState(false);
  const [deviceList, setdeviceList] = useState<BleManager.Peripheral[]>([]);
  useEffect(() => {
    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
    });
  }, []);
  return (
    <View>
      <Spinner visible={isLoading} textContent={'Loading...'} />
      <View style={styles.titleContainer}>
        <Text h2>Search for Device</Text>
      </View>
      <View style={styles.btnContainer}>
        <Button
          buttonStyle={styles.btn}
          title="Scan"
          onPress={async () => {
            console.log('Tst');
            BleManager.getConnectedPeripherals([]).then(v => {
              console.log('Connections');
              console.log(v);
            });
            setisLoading(true);
            BleManager.scan([], 2, true).then(() => {
              setTimeout(() => {
                BleManager.stopScan().then(() => {
                  // Success code
                  console.log('Scan stopped');
                  BleManager.getDiscoveredPeripherals().then(
                    peripheralsArray => {
                      setdeviceList(peripheralsArray);
                      setisLoading(false);
                    },
                  );
                });
              }, 2000);
            });
          }}
        />
      </View>

      <ScrollView>
        {deviceList.map(device => {
          // var uuid = Array.from(
          //   device.advertising.manufacturerData.bytes,
          //   function (byte: number) {
          //     if (byte === 0) {
          //       return '';
          //     }
          //     return ('0' + (byte & 0xff).toString(16)).slice(-2);
          //   },
          // ).join('');
          // console.log(device);
          if (!device.name) {
            return null;
          }
          return (
            <TouchableOpacity
              onPress={async () => {
                setisLoading(true);
                await BleManager.connect(device.id)
                  .then(async () => {
                    BleManager.retrieveServices(
                      device.id,
                      device.advertising.serviceUUIDs,
                    ).then(v => {
                      setisLoading(false);
                      navigation.navigate('ConnectionScreen', v);
                    });
                  })
                  .catch(() => {
                    setisLoading(false);
                  });

                console.log('connect');
              }}
              key={device.id}>
              <ListItem topDivider>
                <ListItem.Content>
                  <ListItem.Title>
                    {device.name} | {device.id}
                  </ListItem.Title>
                  <ListItem.Subtitle>
                    {device.advertising.serviceUUIDs?.length} Services
                  </ListItem.Subtitle>
                </ListItem.Content>
              </ListItem>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: 'center',
    padding: 40,
  },
  btnContainer: {padding: 20, alignItems: 'center'},
  btn: {
    height: 50,
    borderRadius: 10,
    width: 150,
  },
});
