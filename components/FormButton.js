import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';

const FormButton = ({title, ...rest}) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} {...rest}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
    backgroundColor: '#A6D86D',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 18,
    padding: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});