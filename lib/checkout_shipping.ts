import {
  getAnchor,
  getParent,
  getTargets,
  addressRetrieval,
  generateTimer,
  Binding,
  Config,
} from "@ideal-postcodes/jsutil";

import { Address } from "@ideal-postcodes/api-typings";

export const pageTest = (): boolean =>
  document.querySelector(".woocommerce-checkout") !== null;

export const selectors = {
  line_1: "#shipping_address_1",
  line_2: "#shipping_address_2",
  post_town: "#shipping_city",
  county: "#shipping_state",
  postcode: "#shipping_postcode",
  organisation: "#shipping_company",
  country: "#shipping_country",
};

export const bind = (config: Config) => {
  const anchor = getAnchor(selectors.line_1) as HTMLInputElement;
  if (anchor === null) return;

  // Retrieve other fields by scoping to parent
  const parent = getParent(anchor, "form");
  if (!parent) return;

  // Fetch input fields, abort if key inputs are not present
  const targets = getTargets(parent, selectors);
  if (targets === null) return;

  // Initialise autocomplete instance
  new window.IdealPostcodes.Autocomplete.Controller({
    api_key: config.apiKey,
    inputField: selectors.line_1,
    outputFields: {},
    checkKey: true,
    onAddressRetrieved: (address: Address) => {
      addressRetrieval({ targets, config })(address);
      (window.jQuery as any)(document.body).trigger("update_checkout");
    },
    ...config.autocompleteOverride,
  });
};

export const { start, stop } = generateTimer({ pageTest, bind });

export const binding: Binding = {
  pageTest,
  selectors,
  bind,
  start,
  stop,
};
