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
