import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { COLOR } from '../../shared/lb.config';

const Button = ({onPress, children}) => {
  
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};


const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontFamily: 'Muli-Bold'

  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: COLOR.primary,
    borderRadius: 8,
  }
};

export { Button };