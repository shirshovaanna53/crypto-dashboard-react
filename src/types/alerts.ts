export type AlertStatus = 'active' | 'triggered';

export type AlertRule = {
  id: string;
  coinId: string; // CoinGecko id, used by the backend (e.g. "bitcoin")
  symbol: string; // display only (e.g. "btc")
  type: 'PRICE_THRESHOLD' | 'PERCENT_CHANGE';
  params: {
    direction: 'above' | 'below';
    targetPrice: number;
  };
  status: AlertStatus;
  createdAt: string; // ISO-string
  triggeredAt?: string;
  triggeredPrice?: number;
};

export type CreateAlertInput = Pick<AlertRule, 'coinId' | 'symbol' | 'type' | 'params'>;
