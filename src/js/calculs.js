export function soldclient(clientId, operation){
    let sold = 0
    let i  = 0
    while(i < operation.length){
        const op = operation[i]
        if(op.clientId === clientId){
            if(op.type === 'achat'){
                sold = sold + op.montant
            }else{
                sold = sold - op.montant
            }
        }
        i++
    }
    return sold
}
export function moneydispo(client, operation){
    const sold = soldclient(client.id, operation)
    const dispo = client.plafond - sold
    if(dispo < 0){
        return 0
    }
    return dispo
}
export function clienthistory(clientId, operation){
    let i = 0
    let result = []
    while(i < operation.length){
        const op = operation[i]
        if(op.clientId === clientId){
            result.push(op)
        }
        i++
    }
    result.reverse()
    result.sort(function(a,b){
        return b.date.localeCompare(a.date)
    })
    return result
}
export function parsing(input){
    const text = input.trim().replace(',','.')
    const regex = /^\d+(\.\d{1,2})?$/
    if(!regex.test(text)){
        return null
    }
    const splited = text.split('.')
    let first = splited[0]
    let second = splited[1]
    if(second === undefined){
        second = '00'
    }
    if(second.length === 1){
        second += '0'
    }
    return Number(first) * 100 + Number(second)
}
export function moneyformat(centimes){
    const all = Math.floor(centimes / 100)
    let reste = centimes % 100
    if(reste < 10){
        reste = '0' + reste
    }
    return all + ',' + reste + ' MAD'
}
export function today(){
    let d = new Date()
    let month = d.getMonth() + 1 
    let day = d.getDate()
    if(month < 10){
        month = '0' + month
    }
    if(day < 10){
        day = '0' + day
    }
    return d.getFullYear() + '-' + month + '-' + day
}