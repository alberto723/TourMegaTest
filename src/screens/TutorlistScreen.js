/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GetViewportTutors } from '../api';

const RootContainer = styled.SafeAreaView`
  flex: 1;
  background-color: white;
`;
const MainContainer = styled.View`
  flex: 1;
  padding: 20px;
`;
const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

export default function TutorList({ navigation, route }) {
  const { params = {} } = route;
  const { viewport } = params;
  const [tutorList, setTutorList] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: 'Tours ( ' + tutorList.length + ' )',
    });
  }, [navigation, tutorList]);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    console.log('viewport', viewport);
    // const response = await GetTutors(latitude, longitude, delta);
    const response = await GetViewportTutors(viewport);
    setTutorList(response.data || []);
    console.log(response.data);
  };

  const renderItem = ({ item, index }) => {
    return (
      <ItemContainer>
        <FastImage
          source={{ uri: item.thumbnail_url }}
          style={{ width: 100, height: 100, borderRadius: 10 }}
          resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{ marginLeft: 20, flex: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
          <View style={styles.locationSection}>
            <Ionicons name="location-sharp" size={20} color="#CAD1DE" />
            <Text style={{ color: 'black' }}>{item.city}</Text>
          </View>
          <Text style={styles.priceText}>${item.price_in_usd}</Text>
        </View>
      </ItemContainer>
    );
  };

  return (
    <RootContainer>
      <MainContainer>
        <FlatList
          data={tutorList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </MainContainer>
    </RootContainer>
  );
}

const styles = StyleSheet.create({
  locationSection: {
    flexDirection: 'row',
    marginVertical: 5,
    alignItems: 'center',
  },
  priceText: {
    marginLeft: 5,
    color: '#3273E5',
  },
});
