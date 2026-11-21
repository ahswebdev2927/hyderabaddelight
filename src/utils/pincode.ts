/**
 * Hyderabad Delight Dairy - Pincode Serviceability Engine
 * Covers Greater Hyderabad, Secunderabad, and adjoining growth corridors.
 */

export interface PincodeCheckResult {
  pincode: string;
  serviceable: boolean;
  areaName?: string;
  deliverySlot?: string;
  message: string;
}

export const HYDERABAD_LOCALITY_MAP: Record<string, string> = {
  "500001": "Abids / Koti",
  "500002": "Charminar / Falaknuma",
  "500003": "Secunderabad",
  "500004": "Khairatabad",
  "500006": "Mangalhat",
  "500007": "Tarnaka / Osmania",
  "500008": "Golconda",
  "500012": "Sultan Bazar",
  "500016": "Begumpet",
  "500018": "Sanath Nagar",
  "500019": "Serilingampally / BHEL",
  "500020": "Musheerabad",
  "500024": "Dilsukhnagar",
  "500025": "Bowenpally",
  "500026": "Marredpally",
  "500028": "Mehdipatnam",
  "500029": "Himayatnagar",
  "500032": "Gachibowli / Financial District",
  "500033": "Jubilee Hills / Film Nagar",
  "500034": "Banjara Hills",
  "500035": "LB Nagar",
  "500036": "Malakpet",
  "500038": "SR Nagar / Ameerpet",
  "500039": "Uppal",
  "500044": "Vidyanagar / Nallakunta",
  "500045": "Yousufguda",
  "500049": "Miyapur / Hafeezpet",
  "500050": "Chandanagar",
  "500055": "Jeedimetla",
  "500060": "Kothapet",
  "500062": "ECIL / Kapra",
  "500067": "Bolarum",
  "500070": "Vanasthalipuram",
  "500072": "Kukatpally / KPHB Colony",
  "500073": "Srinagar Colony",
  "500075": "Gandipet / Kokapet / Narsingi",
  "500079": "Karmanghat",
  "500080": "Alwal",
  "500081": "Madhapur / Hitec City",
  "500082": "Somajiguda / Panjagutta",
  "500084": "Kondapur",
  "500089": "Manikonda / Puppalguda",
  "500090": "Nizampet / Pragathi Nagar",
  "500091": "Attapur / Rajendranagar",
  "500095": "Koti",
  "502032": "Tellapur / Kollur",
  "501505": "Shankarpally Corridor",
};

/**
 * Checks whether a given 6-digit Indian postal code is within Hyderabad Delight Dairy's morning delivery network.
 */
export function checkPincodeServiceability(pincode: string): PincodeCheckResult {
  const cleanPin = (pincode || "").replace(/\D/g, "").trim();

  if (cleanPin.length !== 6) {
    return {
      pincode: cleanPin,
      serviceable: false,
      message: "Please enter a valid 6-digit postal pincode.",
    };
  }

  const areaName = HYDERABAD_LOCALITY_MAP[cleanPin];

  // All 500xxx pincodes (Greater Hyderabad & Secunderabad) and specific suburban corridors
  const isHyderabadCode = cleanPin.startsWith("500") || cleanPin === "502032" || cleanPin === "501505";

  if (isHyderabadCode) {
    const displayArea = areaName ? `${areaName}, Hyderabad` : "Hyderabad Region";
    return {
      pincode: cleanPin,
      serviceable: true,
      areaName: displayArea,
      deliverySlot: "Tomorrow 5:30 AM – 7:30 AM",
      message: `Fresh morning delivery available in ${displayArea}! Delivery slot: 5:30 AM – 7:30 AM.`,
    };
  }

  return {
    pincode: cleanPin,
    serviceable: false,
    message: `Delivery is currently not available to pincode ${cleanPin}. We deliver across Hyderabad & Secunderabad (pincodes starting with 500xxx). For special requests, call +91 98765 43210.`,
  };
}

