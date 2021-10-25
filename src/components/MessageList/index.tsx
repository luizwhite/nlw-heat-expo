import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { io } from 'socket.io-client';

import { api } from '@/services/api';

import { MESSAGES_EXAMPLE } from '../../../utils/messages';
import { IMessage, Message } from '../Message';
import { styles } from './styles';

const messagesQueue: IMessage[] = MESSAGES_EXAMPLE;

const socket = io(String(api.defaults.baseURL));
socket.on('new_message', (msg) => messagesQueue.push(msg));

export function MessageList() {
  const [currentMessages, setCurrentMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    async function fetchMessages() {
      const { data: messages } = await api.get<IMessage[]>('/messages/last3');
      setCurrentMessages(messages);
    }

    fetchMessages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (messagesQueue.length > 0) {
        setCurrentMessages((prevState) => [
          messagesQueue[0],
          prevState[0],
          prevState[1],
        ]);
        messagesQueue.shift();
      }
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="never"
    >
      {currentMessages.map((data) => (
        <Message key={data.id} {...{ data }} />
      ))}
    </ScrollView>
  );
}
