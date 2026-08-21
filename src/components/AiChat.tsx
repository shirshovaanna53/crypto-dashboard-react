import { useState, useEffect } from 'react';
import { Paper, TextInput, Button, Text, Stack, Loader, Group } from '@mantine/core';
import { useSendMessageMutation } from '../services/chatApi';
import { TEXT_COLORS } from '../constants/theme';
import { SUGGESTED_QUESTIONS } from '../constants/questions';

function AiChat() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState<string | null>(null);
  const [sendMessage, { isLoading, isError }] = useSendMessageMutation();

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setReply(null);
    const result = await sendMessage({ message }).unwrap();
    setReply(result.reply);
    setInput('');
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  return (
    <Paper p="md" withBorder radius="md" mt="lg">
      <Text fw={700} mb="sm">
        💬 Ask about the market
      </Text>

      <Group mb="sm" spacing="xs">
        {SUGGESTED_QUESTIONS.map((question) => (
          <Button
            key={question}
            variant="light"
            size="xs"
            onClick={() => handleSend(question)}
            disabled={isLoading}
          >
            {question}
          </Button>
        ))}
      </Group>

      <Stack spacing="xs">
        <TextInput
          placeholder="Type your question..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          disabled={isLoading}
        />
        <Button onClick={() => handleSend(input)} loading={isLoading} disabled={!input.trim()}>
          Ask
        </Button>
      </Stack>

      {isLoading && <Loader size="sm" mt="md" />}
      {isError && (
        <Text c={TEXT_COLORS.negative} mt="md">
          Something went wrong. Please try again.
        </Text>
      )}
      {reply && (
        <Text mt="md" style={{ whiteSpace: 'pre-wrap' }}>
          {reply}
        </Text>
      )}
    </Paper>
  );
}

export default AiChat;
