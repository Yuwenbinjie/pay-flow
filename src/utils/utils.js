import BigNumber from 'bignumber.js'
let commonExponent = new BigNumber(10).pow(18)

export function setMoney(val) {//往库中存取钱时需要*(10^18)
    let bigMoney = new BigNumber(val).times(commonExponent).toFixed()
    return bigMoney
}

export function getMoney(val) {//往库中查看钱时需要/(10^18)
    let bigMoney = new BigNumber(val).div(commonExponent).toFixed(4)
    return bigMoney
}