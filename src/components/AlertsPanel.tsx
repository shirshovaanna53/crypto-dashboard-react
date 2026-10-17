import {
  Tabs,
  Badge,
  Button,
  Group,
  ScrollArea,
  Center,
  Stack,
  Text,
  Alert,
  Loader,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AlertRulesList } from './AlertRulesList';
import { CreateAlertModal } from './CreateAlertModal';
import { getErrorMessage } from '../../utils/getErrorMessage';
import {
  useGetAlertsQuery,
  useCreateAlertMutation,
  useDeleteAlertMutation,
  useRestartAlertMutation,
  useGetFeedQuery,
  useCheckAlertsMutation,
} from '../services/alertsApi';
import { useEffect, useState } from 'react';
import type { CreateAlertInput } from '../types/alerts';
import { AlertsFeed } from './AlertsFeed';

export function AlertsPanel() {
  const [createOpened, { open, close }] = useDisclosure(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: rules = [], isLoading, isError, refetch } = useGetAlertsQuery();
  const [createAlert] = useCreateAlertMutation();
  const [deleteAlert] = useDeleteAlertMutation();
  const [restartAlert] = useRestartAlertMutation();
  const { data: feed = [], isLoading: feedLoading } = useGetFeedQuery();
  const [checkAlerts, { isLoading: checking }] = useCheckAlertsMutation();

  // Check prices once when the panel mounts
  useEffect(() => {
    checkAlerts().catch(() => {
      // Silent: the lists below still show the last known data
    });
  }, [checkAlerts]);

  // Throws on failure on purpose: the modal catches it and shows the message
  const handleCreate = async (input: CreateAlertInput) => {
    await createAlert(input).unwrap();
  };

  // Runs a row action with a busy flag and error reporting
  const runRowAction = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    setActionError(null);
    try {
      await action();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (id: string) => runRowAction(id, () => deleteAlert(id).unwrap());
  const handleRestart = (id: string) => runRowAction(id, () => restartAlert(id).unwrap());

  return (
    <section>
      <Tabs defaultValue="feed" keepMounted>
        <Group position="apart" align="flex-end">
          <Tabs.List>
            <Tabs.Tab
              value="feed"
              rightSection={
                feed.length > 0 ? (
                  <Badge size="xs" circle>
                    {feed.length}
                  </Badge>
                ) : null
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
          <ScrollArea h={540}>
            <AlertsFeed items={feed} loading={feedLoading} />
          </ScrollArea>
        </Tabs.Panel>

        <Tabs.Panel value="rules" pt="md">
          {actionError && (
            <Alert color="red" mb="sm" withCloseButton onClose={() => setActionError(null)}>
              {actionError}
            </Alert>
          )}
          <ScrollArea h={540}>
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
              <AlertRulesList
                rules={rules}
                loading={isLoading}
                busyId={busyId}
                onDelete={handleDelete}
                onRestart={handleRestart}
              />
            )}
          </ScrollArea>
        </Tabs.Panel>
        {checking && <Loader size="xs" />}
      </Tabs>

      <CreateAlertModal opened={createOpened} onClose={close} onCreate={handleCreate} />
    </section>
  );
}

export default AlertsPanel;
