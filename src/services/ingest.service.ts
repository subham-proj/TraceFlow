import { UAParser } from "ua-parser-js";
import * as geoip from "geoip-lite";

export const enrichEvents = async (events: any[], ip: string) => {
  if (!events || !Array.isArray(events)) return events;

  return events.map((event) => {
    if (!event.tags) event.tags = {};

    // Parse User Agent
    if (event.tags.userAgent) {
      const parser = new UAParser(event.tags.userAgent);
      const result = parser.getResult();
      event.tags.browser_name = result.browser.name;
      event.tags.browser_version = result.browser.version;
      event.tags.os_name = result.os.name;
      event.tags.os_version = result.os.version;
      event.tags.device_model = result.device.model;
      event.tags.device_vendor = result.device.vendor;
      event.tags.device_type = result.device.type;
    }

    // Geo Location Lookup
    const geo = geoip.lookup(ip);

    // Add Ingestion Metadata
    event.tags.ip = ip;
    event.tags.received_at = new Date().toISOString();

    if (geo) {
      event.tags.geo_country = geo.country;
      event.tags.geo_region = geo.region;
      event.tags.geo_city = geo.city;
      event.tags.geo_timezone = geo.timezone;
    }

    return event;
  });
};
