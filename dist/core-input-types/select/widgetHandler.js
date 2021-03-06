"use strict";

var handleConfig = {
    priceHandler: function priceHandler(data, config) {
        // console.log('data',data);
        // console.log("stuff", config.pricing.value);
        return data && config.pricing.value ? config.pricing.value[data.value] : 0;
    },
    validator: function validator(data, config) {
        if (config.value.indexOf(data.value) < 0) {
            return "Selected value: " + data.value + " not a valid choice";
        }
        return true;
    }
};

module.exports = handleConfig;