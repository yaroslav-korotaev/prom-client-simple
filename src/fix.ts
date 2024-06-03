import 'prom-client';

declare module 'prom-client' {
  namespace Histogram {
    interface Internal<T extends string> {
      startTimer(): (labels?: LabelValues<T>) => number;
    }
  }
}
