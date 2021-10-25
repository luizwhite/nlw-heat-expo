import { MotiView } from 'moti';
import React from 'react';
import { View, Text } from 'react-native';

import { UserPhoto } from '../UserPhoto';
import { styles } from './styles';

export interface IMessage {
  id: string;
  text: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

interface IMessageData {
  data: IMessage;
}

export function Message({ data }: IMessageData) {
  const { id, text, user } = data;

  return (
    <MotiView
      key={id}
      style={styles.container}
      from={{ opacity: 0, translateY: -50 }}
      transition={{ type: 'timing', duration: 700 }}
      animate={{ opacity: 1, translateY: 0 }}
    >
      <Text style={styles.message}>{text}</Text>

      <View style={styles.footer}>
        <UserPhoto imageUri={user.avatar_url} sizes="SMALL" />

        <Text style={styles.userName}>{user.name}</Text>
      </View>
    </MotiView>
  );
}
