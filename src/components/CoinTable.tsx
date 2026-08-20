import { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { Avatar, Text, Group } from '@mantine/core';
import { useGetTopCoinsQuery } from '../services/coinGeckoApi';
import type { Coin } from '../types/coin';
import FlashingPrice from './FlashingPrice';
import CoinPriceModal from './CoinPriceModal';
import { /*POLLING_INTERVAL_MS, */ TEXT_COLORS } from '../constants/theme';
import { ERROR_MESSAGES } from '../constants/messages';

function CoinTable() {
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const { data, isLoading, isError } = useGetTopCoinsQuery(undefined, {
    //pollingInterval: selectedCoin ? 0 : POLLING_INTERVAL_MS,
  });

  const columns = useMemo<MRT_ColumnDef<Coin>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Coin',
        Cell: ({ row }) => (
          <Group spacing="sm">
            <Avatar src={row.original.image} size={28} />
            <div>
              <Text size="sm" fw={500}>
                {row.original.name}
              </Text>
              <Text size="xs" c="dimmed">
                {row.original.symbol.toUpperCase()}
              </Text>
            </div>
          </Group>
        ),
      },
      {
        accessorKey: 'current_price',
        header: 'Price',
        Cell: ({ row }) => <FlashingPrice price={row.original.current_price} />,
      },
      {
        accessorKey: 'price_change_percentage_24h',
        header: '24h Change',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          const isPositive = value >= 0;
          return (
            <Text c={isPositive ? TEXT_COLORS.positive : TEXT_COLORS.negative} fw={500}>
              {isPositive ? '+' : ''}
              {value?.toFixed(2)}%
            </Text>
          );
        },
      },
      {
        accessorKey: 'market_cap',
        header: 'Market Cap',
        Cell: ({ cell }) => `$${cell.getValue<number>().toLocaleString()}`,
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: data ?? [],
    state: { isLoading, showAlertBanner: isError },
    mantineToolbarAlertBannerProps: isError
      ? { color: 'red', children: ERROR_MESSAGES.loadingCoins }
      : undefined,
    enableGlobalFilter: true,
    enablePagination: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    mantineTableBodyRowProps: ({ row }) => ({
      onClick: () => setSelectedCoin(row.original),
      style: { cursor: 'pointer' },
    }),
  });

  return (
    <>
      <MantineReactTable table={table} />
      <CoinPriceModal
        coinId={selectedCoin?.id ?? null}
        coinName={selectedCoin?.name ?? ''}
        onClose={() => setSelectedCoin(null)}
      />
    </>
  );
}

export default CoinTable;
