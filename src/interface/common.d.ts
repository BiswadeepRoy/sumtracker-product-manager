export type UrlType = string | null;

interface PaginationUIInterface {
  next: UrlType;
  prev: UrlType;
  reset: boolean;
  onPrevClick?: (prev: UrlType) => void;
  onNextClick?: (next: UrlType) => void;
  onResetClick?: () => void;
}

interface ResultStringInterface {
  pagination: PaginateDataType;
  loading: boolean;
  pageString?: string;
}

type PaginateDataType = {
  next: UrlType;
  prev: UrlType;
  reset: boolean;
  count: number | null;
  count: number | null;
  resultsCount: number;
  limit: number | null;
  hasOffset: boolean;
  offset: number | null;
};
