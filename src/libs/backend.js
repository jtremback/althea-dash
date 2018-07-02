// @ts-check
import { actions } from "../store";
import cckd from "camelcase-keys-deep";

async function get(url) {
  const res = await fetch(url);
  const json = await res.json();
  console.log("uncckd", json);
  console.log("cckd", cckd(json));
  console.log("\n\n");
  return cckd(json);
}

function post(url, json) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(json),
    headers: new Headers({ "Content-Type": "application/json" })
  });
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//const url = window.location.hostname + ":4877";
const url = "http://192.168.10.1:4877";

export default class Backend {
  constructor(url) {
    this.url = url;
  }

  async getWifiSettings() {
    return get(url + "/wifi_settings");
  }

  async setWifiSettings(settings) {
    post(url + "/wifi_settings", settings);
  }

  async getNeighborData() {
    return get(url + "/neighbors");
  }

  async getSettings() {
    return get(url + "/settings");
  }

  async getInfo() {
    return get(url + "/info");
  }

  async requestExitConnection(nickname) {
    const res = await post(url + "/settings", {
      exit_client: {
        current_exit: nickname
      }
    });
    console.log(await res.text());
  }
}
