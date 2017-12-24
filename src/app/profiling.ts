import * as xhr from "../profiling/counters/counter.xhr";
import * as changeDetection from "../profiling/counters/counter.changeDetection";
import * as redux from "../profiling/counters/counter.redux";
import * as timers from "../profiling/counters/counter.timers";

xhr.patch();
timers.patch();

export const perfCounters = [
  changeDetection.create,
  xhr.create,
  redux.create,
  timers.create,
];
