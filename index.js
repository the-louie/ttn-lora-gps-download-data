// Copyright © 2017 The Things Network
// Use of this source code is governed by the MIT license that can be found in the LICENSE file.

// @flow

// import { data } from 'ttn'
const fs = require('fs')
const ttn = require('ttn')
const data = ttn.data

const appID = 'gretra-wisnode-1'
const accessKey = 'ttn-account-v2.l3guM_e3ba8A4HICZojraRYeU0ZVwr0k8XNaQuj7xew'

/*
{
  "app_id":"gretra-wisnode-1",
  "dev_id":"gretra-wisnode-1",
  "hardware_serial":"3530353064375714",
  "port":8,
  "counter":107,
  "payload_raw": {"type":"Buffer","data":[136,124,101,64,194]},
  "payload_fields":{
    "calchash":0,
    "hdop":0,
    "inhash":194,
    "lat":57.808602308000005,
    "lon":14.276000584
  },
  "metadata":{
    "time":"2018-05-15T11:27:06.851191182Z",
    "frequency":868.5,
    "modulation":"LORA",
    "data_rate":"SF12BW125",
    "airtime":1318912000,
    "coding_rate":"4/5",
    "gateways":[
      {
        "gtw_id":"jkpg-atollen-868",
        "gtw_trusted":true,
        "timestamp":3658245324,
        "time":"2018-05-15T11:27:06Z",
        "channel":2,
        "rssi":-119,
        "snr":-12.5,
        "rf_chain":1,
        "latitude":57.78003,
        "longitude":14.172518,
        "altitude":150,
        "location_source":"registry"
      }
    ]
  }
}
*/
const main = async function () {
  const client = await data(appID, accessKey)
  client
    .on('uplink', function (devID, payload) {
      const lat = payload.payload_fields.lat
      const lon = payload.payload_fields.lon
      const hdop = payload.payload_fields.hdop

      const time = payload.metadata.time
      const freq = payload.metadata.frequency
      // const data = Buffer.from(payload.payload_raw)
      // const lon = (data[0] * 256 + data[1]) / 10000 + 14
      // const lat = (data[2] * 256 + data[3]) / 10000 + 57
      // const sat = data[4]
      const rssi = payload.metadata.gateways.reduce((acc, curr) => {
        return curr.gtw_id === 'jkpg-atollen-868' ? curr.rssi : acc
      }, null)
      const record = `${time}\t${devID}\t${lat}\t${lon}\t${rssi}\t${hdop}\t${freq}`
      fs.appendFile('./records.txt', record + '\n', (err) => {
        if (err) throw err
        console.log(record)
      })
    })
}

main().catch(function (err) {
  console.error(err)
  process.exit(1)
})
