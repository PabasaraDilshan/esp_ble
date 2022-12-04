import {View} from 'react-native';
import React, {useEffect, useState} from 'react';
import BleManager from 'react-native-ble-manager';
import {ListItem} from '@rneui/themed';
import {bytesToString} from 'convert-string';

const Characteristic: React.FC<{characteristic: any; con: any}> = ({
  characteristic,
  con,
}) => {
  const [val, setval] = useState(null);
  useEffect(() => {
    const refetch = setInterval(() => {
      BleManager.read(
        con.id,
        characteristic.service,
        characteristic.characteristic,
      )
        .then(value => {
          setval(bytesToString(value));
        })
        .catch(e => {
          console.log(e);
          clearInterval(refetch);
        });
    }, 2000);
    return () => {
      clearInterval(refetch);
    };
  }, [characteristic.characteristic, characteristic.service, con.id]);
  if (characteristic.characteristic.length < 10) {
    return null;
  }
  return (
    <ListItem>
      <ListItem.Content>
        <ListItem.Title>{characteristic.characteristic}</ListItem.Title>
        <ListItem.Subtitle>Value: {val}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

const ConnectionScreen: React.FC<{route: any}> = ({route}) => {
  const con: BleManager.PeripheralInfo = route.params;

  return (
    <View>
      {con.characteristics?.map(characteristic => {
        return (
          <Characteristic
            key={characteristic.characteristic}
            con={con}
            characteristic={characteristic}
          />
        );
      })}
    </View>
  );
};

export default ConnectionScreen;

// const styles = StyleSheet.create({});
