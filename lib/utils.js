/*
 * Returns percentage available.
 */
function calcPercentage(total, available){
    // 30/40*100 = 75.
    return Math.round(available/total * 100);
}

/*
 * Returns percentage in use.
 */
function calcPercentageInUse(total, available){
    return 100 - calcPercentage(total, available);
}
    
/*
 * Returns percentage IN USE from 0 to 10.
 */
function getBarsInUse(percentage){
    return Math.round(percentage / 10);
}

/*
 * Returns percentage IN USE from 0 to 10 for CPU Zabbix.
 * Zabbix gives values like ("0.0001")
 */
function getBarsInUseCpuZabbix(cpu){
    return Math.round(cpu);
}

/*
 * Returns percentage IN USE from 0 to 10 for CPU New Relic.
 * NR returns the percentage already. Like ("16.2" or "0.21")
 */
function getBarsInUseCpuNewRelic(cpu){
    return Math.round(cpu/10);
}

exports.calcPercentage = calcPercentage;
exports.calcPercentageInUse = calcPercentageInUse;
exports.getBarsInUse = getBarsInUse;

exports.getBarsInUseCpuZabbix = getBarsInUseCpuZabbix;
exports.getBarsInUseCpuNewRelic = getBarsInUseCpuNewRelic;