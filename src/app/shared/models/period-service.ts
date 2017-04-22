import {Store} from "../TSData/store";
import {Record} from "../TSData/record";
export interface IPeriod {
  name: string;
}

export class PeriodService extends Store<IPeriod> {
  endpoint = 'periods';
  recordClass = class Period extends Record {};
  relations = [];
}