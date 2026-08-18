import { useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { Avatar, Text, Group } from '@mantine/core';
import { useGetTopCoinsQuery, type Coin } from '../../services/coinGeckoApi';
import './style.css';

function CoinTable() {
  const { data, isLoading, isError } = useGetTopCoinsQuery();

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
              <Text size="xs" c="dimmed" className="symbol-text">
                {row.original.symbol.toUpperCase()}
              </Text>
            </div>
          </Group>
        ),
      },
      {
        accessorKey: 'current_price',
        header: 'Price',
        Cell: ({ cell }) => `$${cell.getValue<number>().toLocaleString()}`,
      },
      {
        accessorKey: 'price_change_percentage_24h',
        header: '24h Change',
        Cell: ({ cell }) => {
          const value = cell.getValue<number>();
          const isPositive = value >= 0;
          return (
            <Text c={isPositive ? 'teal' : 'red'} fw={500}>
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
    state: {
      isLoading,
      showAlertBanner: isError,
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: 'red', children: 'Error loading data. Please try again later.' }
      : undefined,
    enableGlobalFilter: true, // это и есть встроенный поиск
    enablePagination: true,
    enableColumnActions: false,
    enableDensityToggle: false,
    mantineTableBodyRowProps: { style: { cursor: 'pointer' } },
  });

  return <MantineReactTable table={table} />;
}

export default CoinTable;
