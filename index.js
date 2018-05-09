// Copyright © 2017 The Things Network
// Use of this source code is governed by the MIT license that can be found in the LICENSE file.

// @flow

// import { data } from 'ttn'
const fs = require('fs')
const ttn = require('ttn')
const data = ttn.data

const appID = 'gretra-wisnode-1'
const accessKey = 'ttn-account-v2.l3guM_e3ba8A4HICZojraRYeU0ZVwr0k8XNaQuj7xew'

const main = async function () {
  const client = await data(appID, accessKey)
  client
    .on('uplink', function (devID, payload) {
      const data = Buffer.from(payload.payload_raw)
      const lon = (data[0] * 256 + data[1]) / 10000 + 14
      const lat = (data[2] * 256 + data[3]) / 10000 + 57
      const sat = data[4]
      const rssi = payload.metadata.gateways.reduce((acc, curr) => {
        return curr.gtw_id === 'jkpg-atollen-868' ? curr.rssi : acc
      }, null)
      const record = `${new Date().getTime()}\t${devID}\t${lat}\t${lon}\t${rssi}\t${sat}`
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
