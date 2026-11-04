import { soldclient, moneydispo, clienthistory, parsing, moneyformat, today } from './calculs.js'

console.log(parsing('19,99'))    // 1999
console.log(parsing('19.5'))     // 1950
console.log(parsing('20'))       // 2000
console.log(parsing('abc'))      // null
console.log(parsing('19,999'))   // null
console.log(parsing('-5'))       // null
console.log(parsing(''))         // null

console.log(moneyformat(1999))   // 19,99 MAD
console.log(moneyformat(1905))   // 19,05 MAD
console.log(moneyformat(5000))   // 50,00 MAD

console.log(today())             // 2026-11-04