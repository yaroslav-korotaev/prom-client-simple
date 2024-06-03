import {
  Counter as PromCounter,
  Gauge as PromGauge,
  Histogram as PromHistogram,
  Summary as PromSummary,
  Registry,
  collectDefaultMetrics,
} from 'prom-client';
import {
  type Labels,
  type CounterParams,
  type Counter,
  type GaugeParams,
  type Gauge,
  type HistogramParams,
  type Histogram,
  type SummaryParams,
  type Summary,
} from './types';
import { recollect } from './utils';

export type MetricsParams = {
  parent?: Metrics;
  labels?: Labels;
  defaultMetrics?: boolean;
};

export class Metrics {
  private _parent: Metrics | undefined;
  private _children: Metrics[];
  private _labels: Labels;
  private _registry: Registry;
  
  constructor(params?: MetricsParams) {
    const {
      parent,
      labels = {},
      defaultMetrics = false,
    } = params ?? {};
    
    this._parent = parent;
    this._children = [];
    this._labels = labels;
    this._registry = new Registry();
    this._registry.setDefaultLabels(this._labels);
    
    if (defaultMetrics) {
      collectDefaultMetrics({ register: this._registry });
    }
  }
  
  public destroy(): void {
    if (this._parent) {
      this._parent._children.splice(this._parent._children.indexOf(this), 1);
    }
  }
  
  public child(labels?: Labels): Metrics {
    const child = new Metrics({
      parent: this,
      labels: { ...this._labels, ...labels },
      defaultMetrics: false,
    });
    
    this._children.push(child);
    
    return child;
  }
  
  public counter(params: CounterParams): Counter {
    const { collect, ...rest } = params;
    
    return new PromCounter({
      ...rest,
      collect: recollect(collect),
      registers: [this._registry],
    });
  }
  
  public gauge(params: GaugeParams): Gauge {
    const { collect, ...rest } = params;
    
    return new PromGauge({
      ...rest,
      collect: recollect(collect),
      registers: [this._registry],
    });
  }
  
  public histogram(params: HistogramParams): Histogram {
    const { collect, ...rest } = params;
    
    return new PromHistogram({
      ...rest,
      collect: recollect(collect),
      registers: [this._registry],
    });
  }
  
  public summary(params: SummaryParams): Summary {
    const { collect, ...rest } = params;
    
    return new PromSummary({
      ...rest,
      collect: recollect(collect),
      registers: [this._registry],
    });
  }
  
  public async collect(): Promise<string> {
    let output = await this._registry.metrics();
    
    for (const child of this._children) {
      output += '\n' + await child.collect();
    }
    
    output = output.trim();
    
    return output + '\n';
  }
  
  public get contentType(): string {
    return Registry.PROMETHEUS_CONTENT_TYPE;
  }
}

export type CreateMetricsParams = {
  labels?: Labels;
  defaultMetrics?: boolean;
};

export function createMetrics(params?: CreateMetricsParams): Metrics {
  return new Metrics(params);
}
