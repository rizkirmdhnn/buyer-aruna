import Config from 'react-native-config'

// BASE_URL
const url = {
  development: 'http://139.59.243.28/aruna/api/v1',
  staging: 'http://139.59.243.28/aruna/api/v1',
  production: 'http://webapi.aruna.id/api/v1',
}
const ENV = Config.ENV || 'development'
export const BASE_URL = url[ENV]


// COLOR
export const COLOR = {
  primary: '#006aaf',

  secondary_a: '#009ad3',
  element_a1: '#7ec3de',
  element_a2: '#009ad3',
  element_a3: '#006aaf',
  element_a4: '#005181',

  secondary_b: '#42A5F5',
  element_b1: '#f8bb7c',
  element_b2: '#faa51a',
  element_b3: '#f36e21',
  element_b4: '#ef3f2c'
}
