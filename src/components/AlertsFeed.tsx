import { Paper, Group, Stack, Text, Badge, Center, Loader } from '@mantine/core';
import type { FeedItem } from '../types/alerts';

type Props = {
  items: FeedItem[];
  loading?: boolean;
};

// Small coins can cost fractions of a cent, so allow up to 8 decimals
const usd = (n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 8 })}`;

export function AlertsFeed({ items, loading }: Props) {
  if (loading) {
    return (
      <Center py="xl">
        <Loader size="sm" />
      </Center>
    );
  }

  if (items.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" size="sm">
          Nothing has triggered yet.
        </Text>
      </Center>
    );
  }

  return (
    <Stack spacing="xs">
      {items.map((item) => {
        const below = item.params.direction === 'below';
        return (
          // The same rule can trigger several times (after Restart), so alertId alone is not unique
          <Paper key={`${item.alertId}-${item.triggeredAt}`} withBorder p="sm" radius="md">
            <Group position="apart" noWrap>
              <Text fw={600}>
                {item.symbol.toUpperCase()} {below ? 'dropped below' : 'rose above'}{' '}
                {usd(item.params.targetPrice)}
              </Text>
              <Badge variant="light" color={below ? 'red' : 'green'}>
                {below ? 'Below' : 'Above'}
              </Badge>
            </Group>
            <Text size="sm" mt={4}>
              Price at trigger: {usd(item.triggeredPrice)}
            </Text>
            <Text size="xs" c="dimmed">
              {new Date(item.triggeredAt).toLocaleString('en-US')}
            </Text>
          </Paper>
        );
      })}
    </Stack>
  );
}
