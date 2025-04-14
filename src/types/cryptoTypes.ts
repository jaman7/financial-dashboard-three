export interface CryptoListRes {
  id: string;
  symbol: string;
  name: string;
}

export interface CryptoSummary {
  name: string;
  priceChange: number;
  secondaryChange: number;
}

export interface CryptoHistorySummary {
  date: string;
  price: number;
}

export interface CoinGeckoMarketChartRes {
  prices: [number, number][];
  marketCaps: [number, number][];
  totalVolumes: [number, number][];
}

export interface CryptoHistorySummaryRes {
  prices: number[];
  market_caps: number[];
}

export interface CoinGeckoLinksRes {
  homepage: string[];
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name?: string;
  facebook_username?: string;
  bitcointalk_thread_identifier?: number;
  telegram_channel_identifier?: string;
  subreddit_url?: string;
}

export interface CoinGeckoImageRes {
  thumb: string;
  small: string;
  large: string;
}

export interface CoinGeckoMarketDataRes {
  current_price: Record<string, number>;
  total_value_locked?: number | null;
  mcap_to_tvl_ratio?: number | null;
  fdv_to_tvl_ratio?: number | null;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  market_cap: Record<string, number>;
  total_volume: Record<string, number>;
  high_24h: Record<string, number>;
  low_24h: Record<string, number>;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  ath: Record<string, number>;
  ath_change_percentage: Record<string, number>;
  ath_date: Record<string, string>;
  atl: Record<string, number>;
  atl_change_percentage: Record<string, number>;
  atl_date: Record<string, string>;
  last_updated: string;
}

export interface CoinGeckoCommunityDataRes {
  facebook_likes?: number;
  twitter_followers?: number;
  reddit_average_posts_48h?: number;
  reddit_average_comments_48h?: number;
  reddit_subscribers?: number;
  reddit_accounts_active_48h?: number;
  telegram_channel_user_count?: number;
}

export interface CoinGeckoDeveloperDataRes {
  forks?: number;
  stars?: number;
  subscribers?: number;
  total_issues?: number;
  closed_issues?: number;
  pull_requests_merged?: number;
  pull_request_contributors?: number;
  code_additions_deletions_4_weeks?: {
    additions?: number;
    deletions?: number;
  };
  commit_count_4_weeks?: number;
  last_4_weeks_commit_activity_series?: number[];
}

export interface CoinGeckoPublicInterestStatsRes {
  alexa_rank?: number;
  bing_matches?: number;
}

export interface CoinGeckoTickerRes {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    has_trading_incentive: boolean;
  };
  last: number;
  volume: number;
  converted_last: Record<string, number>;
  converted_volume: Record<string, number>;
  trust_score: string;
  bid_ask_spread_percentage: number;
  timestamp: string;
  last_traded_at: string;
  last_fetch_at: string;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url?: string;
  token_info_url?: string;
  coin_id: string;
  target_coin_id?: string;
}

export interface ICryptoDataRes {
  id?: string;
  symbol?: string;
  name?: string;
  asset_platform_id?: string | null;
  block_time_in_minutes?: number;
  hashing_algorithm?: string | null;
  categories?: string[];
  public_notice?: string | null;
  additional_notices?: string[];
  localization?: Record<string, string>;
  description?: Record<string, string>;
  links?: CoinGeckoLinksRes;
  image?: CoinGeckoImageRes;
  country_origin?: string;
  genesis_date?: string;
  contract_address?: string;
  sentiment_votes_up_percentage?: number;
  sentiment_votes_down_percentage?: number;
  watchlist_portfolio_users?: number;
  market_cap_rank?: number;
  coingecko_rank?: number;
  coingecko_score?: number;
  developer_score?: number;
  community_score?: number;
  liquidity_score?: number;
  public_interest_score?: number;
  market_data?: CoinGeckoMarketDataRes;
  community_data?: CoinGeckoCommunityDataRes;
  developer_data?: CoinGeckoDeveloperDataRes;
  public_interest_stats?: CoinGeckoPublicInterestStatsRes;
  tickers?: CoinGeckoTickerRes[];
}

export interface ICoinGeckoLinks {
  homepage: string[];
  blockchainSite: string[];
  officialForumUrl: string[];
  chatUrl: string[];
  announcementUrl: string[];
  twitterScreenName?: string;
  facebookUsername?: string;
  bitcointalkThreadIdentifier?: number;
  telegramChannelIdentifier?: string;
  subredditUrl?: string;
}

export interface ICoinGeckoImage {
  thumb: string;
  small: string;
  large: string;
}

export interface ICoinGeckoMarketData {
  currentPrice: Record<string, number>;
  totalValueLocked?: number | null;
  mcapToTvlRatio?: number | null;
  fdvToTvlRatio?: number | null;
  roi?: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  circulatingSupply?: number;
  marketCap: Record<string, number>;
  totalVolume: Record<string, number>;
  high24h: Record<string, number>;
  low24h: Record<string, number>;
  priceChange24h: number;
  priceChangePercentage24h: number;
  marketCapChange24h: number;
  marketCapChangePercentage24h: number;
  priceChangePercentage_24h: number;
  ath: Record<string, number>;
  athChangePercentage: Record<string, number>;
  athDate: Record<string, string>;
  atl: Record<string, number>;
  atlChangePercentage: Record<string, number>;
  atlDate: Record<string, string>;
  lastUpdated: string;
}

export interface ICoinGeckoCommunityData {
  facebookLikes?: number;
  twitterFollowers?: number;
  redditAveragePosts48h?: number;
  redditAverageComments48h?: number;
  redditSubscribers?: number;
  redditAccountsActive48h?: number;
  telegramChannelUserCount?: number;
}

export interface ICoinGeckoDeveloperData {
  forks?: number;
  stars?: number;
  subscribers?: number;
  totalIssues?: number;
  closedIssues?: number;
  pullRequestsMerged?: number;
  pullRequestContributors?: number;
  codeAdditionsDeletions4Weeks?: {
    additions?: number;
    deletions?: number;
  };
  commitCount4Weeks?: number;
  last4WeeksCommitActivitySeries?: number[];
}

export interface ICoinGeckoPublicInterestStats {
  alexaRank?: number;
  bingMatches?: number;
}

export interface ICoinGeckoTicker {
  base: string;
  target: string;
  market: {
    name: string;
    identifier: string;
    hasTradingIncentive: boolean;
  };
  last: number;
  volume: number;
  convertedLast: Record<string, number>;
  convertedVolume: Record<string, number>;
  trustScore: string;
  bidAskSpreadPercentage: number;
  timestamp: string;
  lastTradedAt: string;
  lastFetchAt: string;
  isAnomaly: boolean;
  isStale: boolean;
  tradeUrl?: string;
  tokenInfoUrl?: string;
  coinId: string;
  targetCoinId?: string;
}

export interface ICryptoData {
  id?: string;
  symbol?: string;
  name?: string;
  assetPlatformId?: string | null;
  blockTimeInMinutes?: number;
  hashingAlgorithm?: string | null;
  categories?: string[];
  publicNotice?: string | null;
  additionalNotices?: string[];
  localization?: Record<string, string>;
  description?: Record<string, string>;
  links?: ICoinGeckoLinks;
  image?: ICoinGeckoImage;
  countryOrigin?: string;
  genesisDate?: string;
  contractAddress?: string;
  sentimentVotesUpPercentage?: number;
  sentimentVotesDownPercentage?: number;
  watchlistPortfolioUsers?: number;
  marketCapRank?: number;
  coingeckoRank?: number;
  coingeckoScore?: number;
  developerScore?: number;
  communityScore?: number;
  liquidityScore?: number;
  publicInterestScore?: number;
  marketData?: ICoinGeckoMarketData;
  communityData?: ICoinGeckoCommunityData;
  developerData?: ICoinGeckoDeveloperData;
  publicInterestStats?: ICoinGeckoPublicInterestStats;
  tickers?: ICoinGeckoTicker[];
}
