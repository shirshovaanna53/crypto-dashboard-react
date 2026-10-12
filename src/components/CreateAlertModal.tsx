import { useMemo, useState } from 'react';
import {
  Modal,
  Select,
  SegmentedControl,
  NumberInput,
  Button,
  Group,
  Stack,
  Text,
  Loader,
} from '@mantine/core';
import type { CreateAlertInput } from '../types/alerts';
import { useGetTopCoinsQuery } from '../services/coinGeckoApi';

type Props = {
  opened: boolean;
  onClose: () => void;
  onCreate: (input: CreateAlertInput) => Promise<void>;
  defaultCoinId?: string;
};

export function CreateAlertModal({ opened, onClose, onCreate, defaultCoinId }: Props) {
  const { data: coins = [], isLoading, isError, refetch } = useGetTopCoinsQuery();

  const [coinId, setCoinId] = useState<string | null>(defaultCoinId ?? null);
  const [direction, setDirection] = useState<'above' | 'below'>('below');
  const [price, setPrice] = useState<number | ''>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectData = useMemo(
    () =>
      coins.map((coin) => ({
        value: coin.id,
        label: `${coin.name} (${coin.symbol.toUpperCase()})`,
      })),
    [coins],
  );

  const selectedCoin = coins.find((c) => c.id === coinId);
  const isValid = selectedCoin !== undefined && price !== '' && price > 0;

  // Hint for the user: this condition is already true right now
  const alreadyMet =
    selectedCoin && price !== ''
      ? direction === 'below'
        ? selectedCoin.current_price <= price
        : selectedCoin.current_price >= price
      : false;

  const reset = () => {
    setCoinId(defaultCoinId ?? null);
    setDirection('below');
    setPrice('');
    setSubmitError(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!isValid || !selectedCoin || (price as unknown) === '') return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onCreate({
        coinId: selectedCoin.id,
        symbol: selectedCoin.symbol,
        type: 'PRICE_THRESHOLD',
        params: { direction, targetPrice: price },
      });
      handleClose();
    } catch (err) {
      setSubmitError(getErrorMessage(err)); // e.g. "Rule limit reached (20)"
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal opened={opened} onClose={handleClose} title="New alert rule" centered>
      <Stack>
        <Select
          label="Coin"
          placeholder={isLoading ? 'Loading coins...' : 'Select a coin'}
          data={selectData}
          value={coinId}
          onChange={setCoinId}
          searchable
          nothingFound="No coins found"
          disabled={isLoading || isError}
          rightSection={isLoading ? <Loader size="xs" /> : undefined}
          error={isError ? 'Failed to load coins' : undefined}
        />
        {isError && (
          <Button size="xs" variant="light" onClick={() => refetch()}>
            Retry
          </Button>
        )}

        <div>
          <Text size="sm" fw={500} mb={4}>
            Condition
          </Text>
          <SegmentedControl
            fullWidth
            value={direction}
            onChange={(v) => setDirection(v as 'above' | 'below')}
            data={[
              { label: 'Price drops below', value: 'below' },
              { label: 'Price rises above', value: 'above' },
            ]}
          />
        </div>

        <NumberInput
          label="Target price, USD"
          placeholder="e.g. 60000"
          description={
            selectedCoin
              ? `Current price: $${selectedCoin.current_price.toLocaleString('en-US')}`
              : undefined
          }
          value={price}
          onChange={setPrice}
          min={0}
          precision={8} // small coins can cost fractions of a cent
          removeTrailingZeros
          hideControls
        />

        {alreadyMet && (
          <Text size="xs" c="orange">
            This condition is already met at the current price, so the alert would fire immediately.
          </Text>
        )}

        {submitError && (
          <Text size="xs" c="red">
            {submitError}
          </Text>
        )}

        <Group position="right" mt="sm">
          <Button variant="default" onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid} loading={submitting}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
function getErrorMessage(err: unknown): import('react').SetStateAction<string | null> {
  throw new Error('Function not implemented.');
}
