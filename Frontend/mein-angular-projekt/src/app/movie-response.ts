import { Film } from './film';

export interface MovieResponse {
  page: number;
  results: Film[];
  total_pages: number;
  total_results: number;
}
