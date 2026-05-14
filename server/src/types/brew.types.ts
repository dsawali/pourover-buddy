export type CoffeeProcessing =
  | 'washed'
  | 'natural'
  | 'honey'
  | 'anaerobic'
  | 'anaerobic_washed'
  | 'anaerobic_natural'
  | 'wet_hulled'
  | 'thermal_shock'
  | 'other'
  | 'unknown';

export type CoffeeVariety =
  | 'bourbon'
  | 'typica'
  | 'gesha'
  | 'sidra'
  | 'sl28'
  | 'sl34'
  | 'catuai'
  | 'caturra'
  | 'pacamara'
  | 'heirloom'
  | 'liberica'
  | 'other'
  | 'unknown';

export interface BrewRequest {
  brewer: 'conical' | 'flat_bottom';
  processing: CoffeeProcessing;
  variety: CoffeeVariety;
  elevationMeters?: number | undefined;
  roastLevel: 'light' | 'medium' | 'dark';
}
