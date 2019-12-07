if (typeof web3 !== 'undefined')  {
	web3 = new Web3(web3.currentProvider);
} else {
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
web3.eth.defaultAccount = web3.eth.accounts[0];
abiDecoder.addABI(abi);
var BlockchainSplitwiseContractSpec = web3.eth.contract(abi);
var BlockchainSplitwise = BlockchainSplitwiseContractSpec.at(contractAddress)

function getAssociatedTransfers(user){
    var nTfs = BlockchainSplitwise.getDebitCount(user)
    nTfs = nTfs.toNumber();
    var transfers = []
    for (i =1; i<=nTfs; i++){
        transfers.push(BlockchainSplitwise.getIthDebit(user, i-1));
    }
    return transfers;
}

function getUsers(addressOfContract) {
    var users = new Set();
    var nTfs = BlockchainSplitwise.getLastTransferIndex().toNumber();
    for (i = 0; i<nTfs; i++){
        if (!BlockchainSplitwise.isSettled(i+1)){
            users.add(BlockchainSplitwise.getDebtorFor(i+1));
            users.add(BlockchainSplitwise.getCreditorFor(i+1));
        }
    }
	return Array.from(users); 
}

function getTotalOwed(user) {
    var owed = 0;
    getAssociatedTransfers(user)
        .map(function (t) {
            owed += BlockchainSplitwise.getAmountFor(t).toNumber();
        })
    return owed;
}

function getLastActive(user) {
    var lastIndex = BlockchainSplitwise.getDebitCount(user).toNumber()-1;
    if (lastIndex < 0 ) return null;

    var lastTransferId = BlockchainSplitwise.getIthDebit(user, lastIndex);
    return BlockchainSplitwise.getTimeOfTransfer(lastTransferId).toNumber();
}

function add_IOU(creditor, amount) {
    var sender = $("#myaccount").find(":selected").text();
var y = sender.indexOf(' ');
sender = sender.slice(y+1)
    var path = doBFS(creditor, sender);
    if (path == null || path.length == 0){
        explicit_add_IOU(sender, creditor, amount);
        log(sender.substring(38,42) + "---"+amount+"--->" + creditor.substring(38,42));
    } else {
        log("cycle detected: ", path);
        var history = [{id: -1, value: parseInt(amount, 10)}];
        for (i = path.length-1; i>0; i--){
            history.push({
                id: BlockchainSplitwise.getHistory(path[i-1], path[i]).toNumber(),
                value: BlockchainSplitwise.lookup(path[i-1], path[i]).toNumber()
            });
        }
        log("history", history);
        history.sort((a,b) => a.value - b.value);
        log("sorted", history);

        if (history[0].id == -1){
            for (i=1; i<history.length; i++){
                BlockchainSplitwise.modify_IOU(history[i].id, history[0].value);
            }
            getSortedHistory(path, 0);
        } else {
            BlockchainSplitwise.modify_IOU(history[0].id, history[0].value);
            explicit_add_IOU(sender, creditor, amount-history[0].value);
            
            for (i=1; i<history.length; i++){
                if (history[i].id == -1) continue;
                BlockchainSplitwise.modify_IOU(
                    history[i].id, 
                    history[0].value
                );
            }
            getSortedHistory(path, amount-history[0].value);
        }
    }
}

function explicit_add_IOU(debtor, creditor, amount){
    log("IOU "+ web3.eth.defaultAccount + " "+ " " + creditor + " " + amount, null)
    BlockchainSplitwise.add_IOU.sendTransaction(creditor, amount,
        {
            from: debtor,
            gas: 1000000
        });
}

function getSortedHistory(path, amount){
    var history = [{id: -1, value: parseInt(amount, 10)}];
    for (i = path.length-1; i>0; i--){
        history.push({
            id: BlockchainSplitwise.getHistory(path[i-1], path[i]).toNumber(),
            value: BlockchainSplitwise.lookup(path[i-1], path[i]).toNumber()
        });
    }
    log("history", history);
    history.sort((a,b) => a.value - b.value);
    log("sorted", history);
    return history;
}

function getNeighbors(user){
    neighbours = [];
    getAssociatedTransfers(user)
        .map(function (t) {
            neighbours.push(BlockchainSplitwise.getCreditorFor(t));
        })
    return neighbours;
}


function doBFS(start, end) {
	var queue = [[start]];
	while (queue.length >= 1) {
		var cur = queue.shift();
		var lastNode = cur[cur.length-1]
		if (lastNode === end) {
			return cur;
		} else {
			var neighbors = getNeighbors(lastNode);
			for (var i = 0; i < neighbors.length; i++) {
				queue.push(cur.concat([neighbors[i]]));
			}
		}
	}
	return null;
}

function log(description, obj) {
    if (isDebug){
        var logData = description + ": " + (obj !== null ? JSON.stringify(obj, null, 2): "") + "\n\n"; 
        $("#log").html($("#log").html() + logData);
    }
}
