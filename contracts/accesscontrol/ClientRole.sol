// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.0;
import "./Roles.sol";

contract ClientRole {
    event clientAdded(address indexed addr);
    event clientRemoved(address indexed addr);
    Roles.Role clients;

    constructor() {
        Roles.add(clients, msg.sender);
        emit clientAdded(msg.sender);
    }
    
    modifier onlyClient {
        require(Roles.has(clients, msg.sender));
        _;
    }

    function isClient(address account) public view returns (bool){
        return Roles.has(clients, account);
    }

    function addClient(address account) public onlyClient {
        _addClient(account);
    }

    function renounceConsumer() public {
        _removeClient(msg.sender);
    }

    function _addClient(address account) internal {
        Roles.add(clients, account);
        emit clientAdded(account);
    }

    function _removeClient(address account) internal{
        Roles.remove(clients, account);
        emit clientRemoved(account);
    }

}