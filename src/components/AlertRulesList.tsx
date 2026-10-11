import { Paper, Group, Stack, Text, Badge, Button, Center, Loader } from '@mantine/core';
import type { AlertRule } from '../types/alerts';

type Props = {
  rules: AlertRule[];
  loading?: boolean;
  onDelete: (id: string) => void;
  onRestart: (id: string) => void;
};

function describe(rule: AlertRule) {
  const sign = rule.params.direction === 'below' ? '<' : '>';
  return `${rule.symbol.toUpperCase()} ${sign} $${rule.params.targetPrice.toLocaleString('en-US')}`;
}

export function AlertRulesList({ rules, loading, onDelete, onRestart }: Props) {
  if (loading) {
    return (
      <Center py="xl">
        <Loader size="sm" />
      </Center>
    );
  }

  if (rules.length === 0) {
    return (
      <Center py="xl">
        <Text c="dimmed" size="sm">
          No rules yet. Click "+ Create" to add one.
        </Text>
      </Center>
    );
  }

  return (
    <Stack spacing="xs">
      {rules.map((rule) => (
        <Paper key={rule.id} withBorder p="sm" radius="md">
          <Group position="apart" noWrap>
            <div>
              <Text fw={600}>{describe(rule)}</Text>
              <Text size="xs" c="dimmed">
                {rule.status === 'triggered' && rule.triggeredAt
                  ? `Triggered ${new Date(rule.triggeredAt).toLocaleString('en-US')}`
                  : `Created ${new Date(rule.createdAt).toLocaleDateString('en-US')}`}
              </Text>
            </div>

            <Badge color={rule.status === 'active' ? 'green' : 'gray'} variant="light">
              {rule.status === 'active' ? 'Active' : 'Triggered'}
            </Badge>
          </Group>

          <Group position="right" spacing="xs" mt="xs">
            {rule.status === 'triggered' && (
              <Button size="xs" variant="light" onClick={() => onRestart(rule.id)}>
                Restart
              </Button>
            )}
            <Button size="xs" variant="subtle" color="red" onClick={() => onDelete(rule.id)}>
              Delete
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}
