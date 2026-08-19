import { Modal, Loader, Text, Center } from '@mantine/core';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetCoinPriceHistoryQuery } from '../services/coinGeckoApi';
import './CoinPriceModal.css';
import {
  CHART_LINE_COLOR,
  CHART_HEIGHT,
  CHART_MARGIN,
  CHART_STROKE_WIDTH,
  FOCUS_SHADOW,
  DATE_FORMAT_OPTIONS,
} from '../constants/theme';
import { ERROR_MESSAGES } from '../constants/messages';

interface CoinPriceModalProps {
  coinId: string | null;
  coinName: string;
  onClose: () => void;
}

function CoinPriceModal({ coinId, coinName, onClose }: CoinPriceModalProps) {
  const { data, isLoading, isError } = useGetCoinPriceHistoryQuery(coinId ?? '', {
    skip: !coinId,
  });

  const chartData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toLocaleDateString('en-AU', DATE_FORMAT_OPTIONS),
    price,
  }));

  return (
    <Modal
      opened={coinId !== null}
      onClose={onClose}
      title={
        <Text size="xl" fw={700}>
          {coinName} — Last 7 Days
        </Text>
      }
      size="xl"
      styles={{
        close: {
          '&:focus': {
            outline: 'none',
            boxShadow: FOCUS_SHADOW,
            borderRadius: '4px',
          },
        },
      }}
    >
      {isLoading && (
        <Center h={CHART_HEIGHT}>
          <Loader />
        </Center>
      )}

      {isError && (
        <Center h={CHART_HEIGHT}>
          <Text c="red">{ERROR_MESSAGES.loadingPriceHistory}</Text>
        </Center>
      )}

      {chartData && (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={chartData} margin={CHART_MARGIN}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) =>
                typeof value === 'number' || typeof value === 'string'
                  ? `$${Number(value).toLocaleString()}`
                  : ''
              }
              wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
              allowEscapeViewBox={{ x: true, y: true }}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={CHART_LINE_COLOR}
              strokeWidth={CHART_STROKE_WIDTH}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Modal>
  );
}

export default CoinPriceModal;
