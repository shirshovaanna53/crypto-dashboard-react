import { Tabs, Badge, Button, Group, ScrollArea, Center, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AlertRulesList } from './AlertRulesList';
import { CreateAlertModal } from './CreateAlertModal';
//import type { AlertRule, CreateAlertInput } from '../types/alerts';
import { useGetAlertsQuery } from '../services/alertsApi';

export function AlertsPanel() {
  const [createOpened, { open, close }] = useDisclosure(false);

  const { data: rules = [], isLoading, isError, refetch } = useGetAlertsQuery();

  // create/delete/restart are wired to the API tomorrow
  const noop = () => {};

  return (
    <section>
      <Tabs defaultValue="feed" keepMounted>
        <Group position="apart" align="flex-end">
          <Tabs.List>
            <Tabs.Tab
              value="feed"
              rightSection={
                <Badge size="xs" circle>
                  0
                </Badge>
              }
            >
              Feed
            </Tabs.Tab>
            <Tabs.Tab value="rules">Rules</Tabs.Tab>
          </Tabs.List>
          <Button size="xs" onClick={open}>
            + Create
          </Button>
        </Group>

        <Tabs.Panel value="feed" pt="md">
          <ScrollArea h={600}>{/* AlertsFeed will be added in stage 2 */}</ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="rules" pt="md">
          <ScrollArea h={600}>
            {isError ? (
              <Center py="xl">
                <Stack align="center" spacing="xs">
                  <Text c="red" size="sm">
                    Failed to load alert rules
                  </Text>
                  <Button size="xs" variant="light" onClick={() => refetch()}>
                    Retry
                  </Button>
                </Stack>
              </Center>
            ) : (
              <AlertRulesList rules={rules} loading={isLoading} onDelete={noop} onRestart={noop} />
            )}
          </ScrollArea>
        </Tabs.Panel>
      </Tabs>

      <CreateAlertModal opened={createOpened} onClose={close} onCreate={noop} />
    </section>
  );
}

export default AlertsPanel;
