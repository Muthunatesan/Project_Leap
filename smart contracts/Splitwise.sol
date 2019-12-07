pragma solidity ^0.5;

import "./Transactions.sol";
import "./Splitwise2.sol";

contract Splitwise is Splitwise2 {
    
    Transactions transactions;
    
    constructor() public {
        transactions = new Transactions();
    }
    
    function lookup(address _debtor, address _creditor)
        public
        view
        returns (uint)
    {
        uint id = transactions.getHistory(_debtor, _creditor);
        if (id == 0 || transactions.isSettled(id)){
            return 0;
        }
        return transactions.getAmountFor(id);
    }
    
    function add_IOU(address _creditor, uint _amount)
        public
        validCreditor(_creditor)
    {
        bool isNew = true;
        uint id = transactions.getHistory(msg.sender, _creditor);
        if (id == 0) {
            transactions.add(msg.sender, _creditor, _amount);
        } else {
            isNew = false;
            transactions.update(id, _amount);
        }
        
        emit TransferProcessed(id, isNew,
            msg.sender, _creditor, transactions.getAmountFor(id));
    }
    
    function modify_IOU(uint id, uint _amountToReduce) public {
        require(id > 0, "zero is an invalid transfer id!");
        require(_amountToReduce > 0, "reducing by zero is a waste of gas!");
        require(_amountToReduce <= transactions.getAmountFor(id), "amountToReduce must be the minimum of a cycle!");
        transactions.modify(id, _amountToReduce);
        emit TransferProcessed(id, false,
            transactions.getDebtorFor(id), transactions.getCreditorFor(id), transactions.getAmountFor(id));
    }
    
     
    function getLastTransferIndex()
        external
        view
        returns (uint)
    {
        return transactions.lastTxId();
    }
    
    function getIthDebit(address _user, uint _index)
        external
        view
        returns (uint)
    {
        return transactions.debitTransfers(_user, _index);
    }
    
    function getHistory(address _debtor, address _creditor)
        external
        view
        returns (uint)
    {
        return transactions.getHistory(_debtor, _creditor);
    }
     
    function getDebitCount(address _user)
        external
        view
        returns (uint)
    {
        return transactions.getTransferCount(_user);
    }

    function getDebtorFor(uint id)
        external
        view
        returns (address)
    {
        return transactions.getDebtorFor(id);
    }

    function getCreditorFor(uint id)
        external
        view
        returns (address)
    {
        return transactions.getCreditorFor(id);
    }

    function getAmountFor(uint id)
        external
        view
        returns (uint)
    {
        return transactions.getAmountFor(id);
    }

    function isSettled(uint id)
        external
        view
        returns (bool)
    {
        return transactions.isSettled(id);
    }

    function getTimeOfTransfer(uint id)
        external
        view
        returns (uint)
    {
        return transactions.getTimeOfTransfer(id);
    }
}
