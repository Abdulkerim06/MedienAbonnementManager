export interface WatchProviderItem {
  providerId: number;
  providerName: string;
  logoUrl: string;
}

export interface WatchProviderGroup {
  label: string;
  providers: WatchProviderItem[];
}

export interface MovieWatchOptions {
  countryCode: string;
  link: string | null;
  groups: WatchProviderGroup[];
}
