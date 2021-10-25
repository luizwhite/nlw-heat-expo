import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ColorValue,
  ActivityIndicator,
} from 'react-native';

import { styles } from './styles';

interface IButton extends TouchableOpacityProps {
  title: string;
  color: ColorValue;
  backgroundColor: ColorValue;
  icon?: React.ComponentProps<typeof AntDesign>['name'];
  isLoading?: boolean;
}

export function Button({
  title,
  color,
  backgroundColor,
  isLoading = false,
  icon,
  ...rest
}: IButton) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      activeOpacity={0.7}
      disabled={isLoading}
      {...rest}
    >
      {!isLoading ? (
        <>
          {icon && <AntDesign name={icon} size={24} style={styles.icon} />}
          <Text style={[styles.title, { color }]}>{title}</Text>
        </>
      ) : (
        <ActivityIndicator color={color} />
      )}
    </TouchableOpacity>
  );
}
