import {Profiler} from "./profiler";
import {CounterSet} from "./counterSet";

export interface CounterOptions {
  noAvg?: boolean;
  noLastValue?: boolean;
}

export class Counter {
  profiler: Profiler;
  set: CounterSet;
  lastValue: any;
  avg: any;
  sum: any;
  count: number;
  options: CounterOptions;

  constructor(public name: string, options?: CounterOptions) {
    this.options = options || {};
    this.count = 0;
  }

  profile(obj, methodName: string) {
    const me = this;
    const original = obj[methodName];

    obj[methodName] = function() {
      const before = performance.now();

      const retVal = original.apply(this, arguments);

      const after = performance.now();

      const time = after - before;

      me.update(time);

      return retVal;
    }
  }

  execAndUpdate(func) {
    const before = performance.now();

    const retVal = func();

    const after = performance.now();

    this.update(after-before);

    return retVal;
  }

  public clone() {
    return new Counter(this.name, this.options);
  }

  private isProto() {
    return this.set == null;
  }

  update(value, inc: boolean = true) {
    if(this.isProto()) {
      this.profiler.updateCounter(this, value, inc);
      return;
    }

    if(!this.options.noLastValue) {
      this.lastValue = value;
    }

    if(!this.options.noAvg) {
      if (this.sum == undefined) {
        this.sum = value;
      }
      else {
        this.sum += value;
      }
    }

    if(inc) {
      ++this.count;
    }

    if(!this.options.noAvg) {
      this.avg = this.sum / this.count;
    }

    this.onUpdated();
  }

  inc() {
    if (this.isProto()) {
      this.profiler.incCounter(this);
      return;
    }

    this.count++;

    this.onUpdated();
  }

  dec() {
    if (this.isProto()) {
      this.profiler.decCounter(this);
      return;
    }

    this.count--;

    this.onUpdated();
  }

  private onUpdated() {
    if(this.set) {
      this.set.profiler._onCounterUpdated(this);
    }
  }

  onAddedAsProto(profiler: Profiler) {
    this.profiler = profiler;
  }

  onAddedToSet(set: CounterSet) {
    this.set = set;
    this.profiler = set.profiler;
  }

  reset() {
    if(this.isProto()) {
      this.profiler.resetCounter(this);
      return;
    }

    this.count = 0;
    this.lastValue = undefined;
    this.avg = undefined;
    this.sum = undefined;

    this.onUpdated();
  }
}
