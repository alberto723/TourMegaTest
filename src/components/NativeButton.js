import React from 'react';
import { Text, StyleSheet } from 'react-native';
import styled from 'styled-components';

const ButtonContainer = styled.TouchableOpacity`
  width: 100%;
  background-color: #ff893b;
  border-radius: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  align-items: center;
`;

export default function NativeButton({ onPress, style, text }) {
  return (
    <ButtonContainer style={style} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </ButtonContainer>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
  },
});
