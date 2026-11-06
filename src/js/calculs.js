
export function soldclient(clientId, operation){
    let sold = 0
    let i = 0

    while(i < operation.length){
        const op = operation[i]

        if(op.clientId === clientId){
            if(op.type === 'achat'){
                sold += op.montant
            }else if(op.type === 'remboursement'){
                sold -= op.montant
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



export function countclients(clients){
    return clients.length
}

export function CountClientInDebt(clients, operation){
    let count = 0
    let i = 0

    while(i < clients.length){
        const sold = soldclient(clients[i].id, operation)

        if(sold > 0){
            count++
        }

        i++
    }

    return count
}

export function getTotal(clients, operation){
    let i = 0
    let total = 0

    while(i < clients.length){
        const sold = soldclient(clients[i].id, operation)

        if(sold > 0){
            total += sold
        }

        i++
    }

    return total
}

export function getclientstatus(client, operation){
    const sold = soldclient(client.id, operation)

    if(sold <= 0){
        return 'À jour'
    }

    const history = clienthistory(client.id, operation)

    let dataref = ''
    let i = 0

    while(i < history.length){
        if(history[i].type === 'remboursement'){
            dataref = history[i].date
            break
        }

        i++
    }

    if(dataref === ''){
        let j = history.length - 1

        while(j >= 0){
            if(history[j].type === 'achat'){
                dataref = history[j].date
                break
            }

            j--
        }
    }

    if(dataref !== ''){
        const diff = new Date(today() + 'T00:00:00').getTime() - new Date(dataref + 'T00:00:00').getTime()
        const days = diff / (1000 * 60 * 60 * 24)

        if(days > 30){
            return 'En retard'
        }
    }

    return 'En dette'
}

export function countlaterclients(clients, operation){
    let i = 0
    let count = 0

    while(i < clients.length){
        const status = getclientstatus(clients[i], operation)

        if(status === 'En retard'){
            count++
        }

        i++
    }

    return count
}

export function isPlafondAtteint(client, operation){
    const sold = soldclient(client.id, operation)

    if(sold > 0 && moneydispo(client, operation) === 0){
        return true
    }

    return false
}

