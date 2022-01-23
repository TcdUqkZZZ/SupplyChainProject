// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "./Roles.sol";

contract merchantRole {
    event merchantAdded(address indexed addr);
    event merchantRemoved(address indexed addr);
    Roles.Role merchants;

    constructor() {
        Roles.add(merchants, msg.sender);
        emit merchantAdded(msg.sender);
    }
    
    modifier onlyMerchant {
        require(Roles.has(merchants, msg.sender));
        _;
    }

    function isMerchant(address account) public view returns (bool){
        return Roles.has(merchants, account);
    }

    function addMerchant(address account) public onlyMerchant {
        _addMerchant(account);
    }

    function renounceMerchant() public {
        _removeMerchant(msg.sender);
    }

    function _addMerchant(address account) internal {
        Roles.add(merchants, account);
        emit merchantAdded(account);
    }

    function _removeMerchant(address account) internal{
        Roles.remove(merchants, account);
        emit merchantRemoved(account);
    }

}