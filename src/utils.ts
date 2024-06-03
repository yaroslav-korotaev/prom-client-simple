import { type CollectFunction as PromCollect } from 'prom-client';
import { type Collect } from './types';

export function recollect<T>(collect: Collect<T> | undefined): PromCollect<T> | undefined {
  if (!collect) {
    return undefined;
  }
  
  return function () {
    return collect(this);
  };
}
