// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "./Trustable.sol";

contract Bridge is Trustable {
    using EnumerableSet for EnumerableSet.UintSet;
    using SafeERC20 for ERC20;

    struct Order {
        uint id;
        uint16 tokenId;
        address sender;
        address target;
        uint amount;
        uint8 decimals;
        uint8 destination;
    }

    struct Token {
        ERC20 token;
        uint16 fee;
        uint feeBase;
        address feeTarget;
        uint minAmount;
        uint maxAmount;
        uint dailyLimit;
        uint bonus;
    }

    struct UserStats {
        uint transfered;
        uint limitFrom;
    }

    event OrderCreated(uint indexed id, Order order, uint fee);
    event OrderCompleted(uint indexed id, uint8 indexed dstFrom);

    uint nextOrderId = 0;
    uint16 tokensLength = 0;

    mapping (uint16 => Token) public tokens;
    mapping (uint16 => mapping (address => UserStats)) public stats;
    mapping (uint => Order) public orders;
    EnumerableSet.UintSet private orderIds;
    mapping (bytes32 => bool) public completed;

    function setToken(
        uint16 tokenId,
        ERC20 token,
        uint16 fee,
        uint feeBase,
        address feeTarget,
        uint minAmount,
        uint maxAmount,
        uint dailyLimit,
        uint8 inputDecimals
    ) external onlyOwner {
        require(fee <= 10000, "invalid fee");
        tokens[tokenId] = Token(
            token,
            fee,
            convertAmount(token, feeBase, inputDecimals),
            feeTarget,
            convertAmount(token, minAmount, inputDecimals),
            convertAmount(token, maxAmount, inputDecimals),
            convertAmount(token, dailyLimit, inputDecimals),
            0
        );
        if (tokenId + 1 > tokensLength) {
            tokensLength = tokenId + 1;
        }
    }

    function convertAmount(ERC20 token, uint amount, uint decimals) view internal returns (uint) {
        return amount * (10 ** token.decimals()) / (10 ** decimals);
    }

    function setFee(uint16 tokenId, uint16 fee) external onlyOwner {
        require(fee <= 10000, "invalid fee");
        tokens[tokenId].fee = fee;
    }

    function setFeeBase(uint16 tokenId, uint feeBase, uint8 inputDecimals) external onlyOwner {
        tokens[tokenId].feeBase = convertAmount(tokens[tokenId].token, feeBase, inputDecimals);
    }

    function setFeeTarget(uint16 tokenId, address feeTarget) external onlyOwner {
        tokens[tokenId].feeTarget = feeTarget;
    }

    function setDailyLimit(uint16 tokenId, uint dailyLimit, uint8 inputDecimals) external onlyOwner {
        tokens[tokenId].dailyLimit = convertAmount(tokens[tokenId].token, dailyLimit, inputDecimals);
    }

    function setMinAmount(uint16 tokenId, uint minAmount, uint8 inputDecimals) external onlyOwner {
        tokens[tokenId].minAmount = convertAmount(tokens[tokenId].token, minAmount, inputDecimals);
    }

    function setMaxAmount(uint16 tokenId, uint maxAmount, uint8 inputDecimals) external onlyOwner {
        tokens[tokenId].maxAmount = convertAmount(tokens[tokenId].token, maxAmount, inputDecimals);
    }

    function setBonus(uint16 tokenId, uint bonus) external onlyOwner {
        tokens[tokenId].bonus = bonus;
    }

    function create(uint16 tokenId, uint amount, uint8 destination, address target) external {
        Token storage tok = tokens[tokenId];
        require(address(tok.token) != address(0), "unknown token");

        require(amount >= tok.minAmount, "amount lower than mininum");
        require(amount <= tok.maxAmount, "amount greater than mininum");

        UserStats storage st = stats[tokenId][msg.sender];

        bool lastIsOld = st.limitFrom + 24 hours < block.timestamp;
        if (lastIsOld) {
            st.limitFrom = block.timestamp;
            st.transfered = 0;
        }
        require(st.transfered + amount <= tok.dailyLimit, "daily limit exceed");
        st.transfered += amount;

        uint feeAmount = tok.feeBase + amount * tok.fee / 10000;
        if (feeAmount > 0) {
            tok.token.safeTransferFrom(msg.sender, tok.feeTarget, feeAmount);
        }

        amount = amount - feeAmount;
        tok.token.safeTransferFrom(msg.sender, address(this), amount);

        orders[nextOrderId] = Order(
            nextOrderId,
            tokenId,
            msg.sender,
            target,
            amount,
            tok.token.decimals(),
            destination
        );
        orderIds.add(nextOrderId);

        emit OrderCreated(nextOrderId, orders[nextOrderId], feeAmount);
        nextOrderId++;
    }

    function close(uint orderId) external onlyTrusted {
        orderIds.remove(orderId);
    }

    function completeOrder(uint orderId, uint8 dstFrom, uint16 tokenId, address payable to, uint amount, uint decimals) external onlyTrusted {
        bytes32 orderHash = keccak256(abi.encodePacked(orderId, dstFrom));
        require (completed[orderHash] == false, "already transfered");

        Token storage tok = tokens[tokenId];
        require(address(tok.token) != address(0), "unknown token");

        tok.token.safeTransfer(to, convertAmount(tok.token, amount, decimals));
        completed[orderHash] = true;

        uint bonus = Math.min(tok.bonus, address(this).balance);
        if (bonus > 0) {
            to.transfer(bonus);
        }

        emit OrderCompleted(orderId, dstFrom);
    }

    function withdraw(uint16 tokenId, address to, uint amount, uint8 inputDecimals) external onlyTrusted {
        Token storage tok = tokens[tokenId];
        tok.token.safeTransfer(to, convertAmount(tok.token, amount, inputDecimals));
    }

    function isCompleted(uint orderId, uint8 dstFrom) external view returns (bool) {
        return completed[keccak256(abi.encodePacked(orderId, dstFrom))];
    }

    function listOrders() external view returns (Order[] memory) {
        Order[] memory list = new Order[](orderIds.length());
        for (uint i = 0; i < orderIds.length(); i++) {
            list[i] = orders[orderIds.at(i)];
        }

        return list;
    }

    function listTokensNames() external view returns (string[] memory) {
        string[] memory list = new string[](tokensLength);
        for (uint16 i = 0; i < tokensLength; i++) {
            if (address(tokens[i].token) != address(0)) {
                list[i] = tokens[i].token.symbol();
            }
        }

        return list;
    }


    receive() external payable {}
}
