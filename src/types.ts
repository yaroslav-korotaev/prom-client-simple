export type Labels = Record<string, string>;

export type Collect<T> = (metric: T) => void | Promise<void>;

export type Stop = () => number;

export type MetricParams = {
	name: string;
	help: string;
	labelNames?: string[];
};

export type CounterParams = MetricParams & {
  collect?: Collect<Counter>;
};

export type CounterMini = {
  inc(value?: number): void;
};

export type Counter = {
  inc(value?: number): void;
  inc(labels: Labels, value?: number): void;
  labels(labels: Labels): CounterMini;
  remove(labels: Labels): void;
  reset(): void;
};

export type GaugeParams = MetricParams & {
  collect?: Collect<Gauge>;
};

export type GaugeMini = {
  inc(value?: number): void;
  dec(value?: number): void;
  set(value: number): void;
};

export type Gauge = {
  inc(value?: number): void;
  inc(labels: Labels, value?: number): void;
  dec(value?: number): void;
  dec(labels: Labels, value?: number): void;
  set(value: number): void;
  set(labels: Labels, value: number): void;
  labels(labels: Labels): GaugeMini;
  remove(labels: Labels): void;
  reset(): void;
};

export type HistogramParams = MetricParams & {
  collect?: Collect<Histogram>;
  buckets?: number[];
};

export type HistogramMini = {
  observe(value: number): void;
  startTimer(): () => number;
};

export type Histogram = {
  observe(value: number): void;
  observe(labels: Labels, value: number): void;
  startTimer(labels?: Labels): Stop;
  labels(labels: Labels): HistogramMini;
  remove(labels: Labels): void;
  zero(labels: Labels): void;
  reset(): void;
};

export type SummaryParams = MetricParams & {
  collect?: Collect<Summary>;
	percentiles?: number[];
	maxAgeSeconds?: number;
	ageBuckets?: number;
};

export type SummaryMini = {
  observe(value: number): void;
  startTimer(): Stop;
};

export type Summary = {
  observe(value: number): void;
  observe(labels: Labels, value: number): void;
  startTimer(labels?: Labels): Stop;
  labels(labels: Labels): SummaryMini;
  remove(labels: Labels): void;
  reset(): void;
};
