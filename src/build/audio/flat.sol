// File: @openzeppelin/contracts/token/ERC20/IERC20.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `recipient`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address recipient, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `sender` to `recipient` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: @openzeppelin/contracts/utils/introspection/IERC165.sol



pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC165 standard, as defined in the
 * https://eips.ethereum.org/EIPS/eip-165[EIP].
 *
 * Implementers can declare support of contract interfaces, which can then be
 * queried by others ({ERC165Checker}).
 *
 * For an implementation, see {ERC165}.
 */
interface IERC165 {
    /**
     * @dev Returns true if this contract implements the interface defined by
     * `interfaceId`. See the corresponding
     * https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
     * to learn more about how these ids are created.
     *
     * This function call must use less than 30 000 gas.
     */
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

// File: @openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol



pragma solidity ^0.8.0;


/**
 * @dev _Available since v3.1._
 */
interface IERC1155Receiver is IERC165 {
    /**
        @dev Handles the receipt of a single ERC1155 token type. This function is
        called at the end of a `safeTransferFrom` after the balance has been updated.
        To accept the transfer, this must return
        `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
        (i.e. 0xf23a6e61, or its own function selector).
        @param operator The address which initiated the transfer (i.e. msg.sender)
        @param from The address which previously owned the token
        @param id The ID of the token being transferred
        @param value The amount of tokens being transferred
        @param data Additional data with no specified format
        @return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed
    */
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4);

    /**
        @dev Handles the receipt of a multiple ERC1155 token types. This function
        is called at the end of a `safeBatchTransferFrom` after the balances have
        been updated. To accept the transfer(s), this must return
        `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
        (i.e. 0xbc197c81, or its own function selector).
        @param operator The address which initiated the batch transfer (i.e. msg.sender)
        @param from The address which previously owned the token
        @param ids An array containing ids of each token being transferred (order and length must match values array)
        @param values An array containing amounts of each token being transferred (order and length must match ids array)
        @param data Additional data with no specified format
        @return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed
    */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external returns (bytes4);
}

// File: @openzeppelin/contracts/token/ERC1155/IERC1155.sol



pragma solidity ^0.8.0;


/**
 * @dev Required interface of an ERC1155 compliant contract, as defined in the
 * https://eips.ethereum.org/EIPS/eip-1155[EIP].
 *
 * _Available since v3.1._
 */
interface IERC1155 is IERC165 {
    /**
     * @dev Emitted when `value` tokens of token type `id` are transferred from `from` to `to` by `operator`.
     */
    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);

    /**
     * @dev Equivalent to multiple {TransferSingle} events, where `operator`, `from` and `to` are the same for all
     * transfers.
     */
    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    /**
     * @dev Emitted when `account` grants or revokes permission to `operator` to transfer their tokens, according to
     * `approved`.
     */
    event ApprovalForAll(address indexed account, address indexed operator, bool approved);

    /**
     * @dev Emitted when the URI for token type `id` changes to `value`, if it is a non-programmatic URI.
     *
     * If an {URI} event was emitted for `id`, the standard
     * https://eips.ethereum.org/EIPS/eip-1155#metadata-extensions[guarantees] that `value` will equal the value
     * returned by {IERC1155MetadataURI-uri}.
     */
    event URI(string value, uint256 indexed id);

    /**
     * @dev Returns the amount of tokens of token type `id` owned by `account`.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function balanceOf(address account, uint256 id) external view returns (uint256);

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {balanceOf}.
     *
     * Requirements:
     *
     * - `accounts` and `ids` must have the same length.
     */
    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        external
        view
        returns (uint256[] memory);

    /**
     * @dev Grants or revokes permission to `operator` to transfer the caller's tokens, according to `approved`,
     *
     * Emits an {ApprovalForAll} event.
     *
     * Requirements:
     *
     * - `operator` cannot be the caller.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns true if `operator` is approved to transfer ``account``'s tokens.
     *
     * See {setApprovalForAll}.
     */
    function isApprovedForAll(address account, address operator) external view returns (bool);

    /**
     * @dev Transfers `amount` tokens of token type `id` from `from` to `to`.
     *
     * Emits a {TransferSingle} event.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - If the caller is not `from`, it must be have been approved to spend ``from``'s tokens via {setApprovalForAll}.
     * - `from` must have a balance of tokens of type `id` of at least `amount`.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155Received} and return the
     * acceptance magic value.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    /**
     * @dev xref:ROOT:erc1155.adoc#batch-operations[Batched] version of {safeTransferFrom}.
     *
     * Emits a {TransferBatch} event.
     *
     * Requirements:
     *
     * - `ids` and `amounts` must have the same length.
     * - If `to` refers to a smart contract, it must implement {IERC1155Receiver-onERC1155BatchReceived} and return the
     * acceptance magic value.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

    function SET_DISVALUE_PARTNERS(uint256 _nft, uint256 _value, address _token) external returns (bool);
    function SET_POWER_UP(address _user,uint256 _power) external returns (bool);
}

// File: contracts/TeaShop.sol

//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;


library SafeMath {

    uint constant TEN9 = 10**9;
  /**
   * @dev Multiplies two unsigned integers, reverts on overflow.
   */
  function mul(uint256 a, uint256 b) internal pure returns (uint256) {

    if (a == 0) {
      return 0;
    }

    uint256 c = a * b;
    require(c / a == b, "SafeMath#mul: OVERFLOW");

    return c;
  }

  /**
   * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
   */
  function div(uint256 a, uint256 b) internal pure returns (uint256) {
    // Solidity only automatically asserts when dividing by 0
    require(b > 0, "SafeMath#div: DIVISION_BY_ZERO");
    uint256 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold

    return c;
  }

  /**
   * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
   */
  function sub(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b <= a, "SafeMath#sub: UNDERFLOW");
    uint256 c = a - b;

    return c;
  }

  /**
   * @dev Adds two unsigned integers, reverts on overflow.
   */
  function add(uint256 a, uint256 b) internal pure returns (uint256) {
    uint256 c = a + b;
    require(c >= a, "SafeMath#add: OVERFLOW");

    return c;
  }

  /**
   * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
   * reverts when dividing by zero.
   */
  function mod(uint256 a, uint256 b) internal pure returns (uint256) {
    require(b != 0, "SafeMath#mod: DIVISION_BY_ZERO");
    return a % b;
  }

  function decMul18(uint x, uint y) public pure returns (uint decProd) {
    uint prod_xy = mul(x, y);
    decProd = add(prod_xy, TEN9 / 2) / TEN9;
  }

    function decDiv18(uint x, uint y) public pure returns (uint decQuotient) {
    uint prod_xTEN9 = mul(x, TEN9);
    decQuotient = add(prod_xTEN9, y / 2) / y;
  }
}

library DateTime {
    uint256 constant SECONDS_PER_DAY = 24 * 60 * 60;
    uint256 constant SECONDS_PER_HOUR = 60 * 60;
    uint256 constant SECONDS_PER_MINUTE = 60;
    int256 constant OFFSET19700101 = 2440588;

    uint256 constant DOW_MON = 1;
    uint256 constant DOW_TUE = 2;
    uint256 constant DOW_WED = 3;
    uint256 constant DOW_THU = 4;
    uint256 constant DOW_FRI = 5;
    uint256 constant DOW_SAT = 6;
    uint256 constant DOW_SUN = 7;

    // ------------------------------------------------------------------------
    // Calculate the number of days from 1970/01/01 to year/month/day using
    // the date conversion algorithm from
    //   http://aa.usno.navy.mil/faq/docs/JD_Formula.php
    // and subtracting the offset 2440588 so that 1970/01/01 is day 0
    //
    // days = day
    //      - 32075
    //      + 1461 * (year + 4800 + (month - 14) / 12) / 4
    //      + 367 * (month - 2 - (month - 14) / 12 * 12) / 12
    //      - 3 * ((year + 4900 + (month - 14) / 12) / 100) / 4
    //      - offset
    // ------------------------------------------------------------------------
    function _daysFromDate(
        uint256 year,
        uint256 month,
        uint256 day
    ) internal pure returns (uint256 _days) {
        require(year >= 1970);
        int256 _year = int256(year);
        int256 _month = int256(month);
        int256 _day = int256(day);

        int256 __days =
            _day -
                32075 +
                (1461 * (_year + 4800 + (_month - 14) / 12)) /
                4 +
                (367 * (_month - 2 - ((_month - 14) / 12) * 12)) /
                12 -
                (3 * ((_year + 4900 + (_month - 14) / 12) / 100)) /
                4 -
                OFFSET19700101;

        _days = uint256(__days);
    }

    function getMinute(uint256 timestamp)
        internal
        pure
        returns (uint256 minute)
    {
        uint256 secs = timestamp % SECONDS_PER_HOUR;
        minute = secs / SECONDS_PER_MINUTE;
    }

    function getSecond(uint256 timestamp)
        internal
        pure
        returns (uint256 second)
    {
        second = timestamp % SECONDS_PER_MINUTE;
    }

    function addDays(uint256 timestamp, uint256 _days)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _days * SECONDS_PER_DAY;
        require(newTimestamp >= timestamp);
    }

    function addHours(uint256 timestamp, uint256 _hours)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _hours * SECONDS_PER_HOUR;
        require(newTimestamp >= timestamp);
    }

    function addMinutes(uint256 timestamp, uint256 _minutes)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp >= timestamp);
    }

    function addSeconds(uint256 timestamp, uint256 _seconds)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp + _seconds;
        require(newTimestamp >= timestamp);
    }

    function subDays(uint256 timestamp, uint256 _days)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _days * SECONDS_PER_DAY;
        require(newTimestamp <= timestamp);
    }

    function subHours(uint256 timestamp, uint256 _hours)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _hours * SECONDS_PER_HOUR;
        require(newTimestamp <= timestamp);
    }

    function subMinutes(uint256 timestamp, uint256 _minutes)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _minutes * SECONDS_PER_MINUTE;
        require(newTimestamp <= timestamp);
    }

    function subSeconds(uint256 timestamp, uint256 _seconds)
        internal
        pure
        returns (uint256 newTimestamp)
    {
        newTimestamp = timestamp - _seconds;
        require(newTimestamp <= timestamp);
    }

    function diffHours(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _hours)
    {
        require(fromTimestamp <= toTimestamp);
        _hours = (toTimestamp - fromTimestamp) / SECONDS_PER_HOUR;
    }

    function diffMinutes(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _minutes)
    {
        require(fromTimestamp <= toTimestamp);
        _minutes = (toTimestamp - fromTimestamp) / SECONDS_PER_MINUTE;
    }

    function diffSeconds(uint256 fromTimestamp, uint256 toTimestamp)
        internal
        pure
        returns (uint256 _seconds)
    {
        require(fromTimestamp <= toTimestamp);
        _seconds = toTimestamp - fromTimestamp;
    }
}


contract CAFE {

    using SafeMath for uint256;

    event roomOpen(

        uint256 _room,
        address _owner
    );
    event roomClosed(

        uint256 _room,
        address _owner
    );
    event passConnected(

        uint256 _room,
        address _listener
    );
    event roomExit(

        uint256 _room,
        address _listener
    );
    event handRaised(
      uint256 _room,
      address _listerner
    );
    struct ROOMS{

      uint256 id;
      address host;
      string title;
      string info;
      uint256 earnings;
      uint256 start;
      uint256 stop;
      uint256 fee;
      bool paid;
      uint256 rate;
      uint256 timePay;
      string category;
    }
    ROOMS[] public rooms;

    struct NFTS{

      uint256 id;
      uint256 price;
      string ipfs;
      bool canTransfer;
      uint256 quantity;
    }
    NFTS[] public nft;

    mapping(uint256=>NFTS) public idToNFT;
    mapping(uint256=>ROOMS) public idToRoom;
    mapping(address=>mapping(uint256=>ROOMS)) public hostToRoom;
    mapping(address=>uint256[]) public hostToAllRooms;
    mapping(uint256=>address[]) public roomToCoHosts;
    mapping(uint256=>address[]) public roomToListeners;
    mapping(address=>uint256) public listenerToRoom;
    mapping(uint256=>uint256) public roomToEarnings;
    mapping(address=>bool) public isAdmin;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToStartTime;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToEndTime;
    mapping(address=>mapping(uint256=>uint256)) public listenerToRoomToPayment;
    mapping(address=>uint256) public listenerToTotalPayment;
    mapping(address=>uint256) public hostToTotalEarned;
    mapping(address=>uint256) public userToWarning;
    mapping(address=>bool) public banned;
    mapping(address=>uint256) public bannedExpire;
    mapping(address=>uint256) public userToNftForBanRemove;
    mapping(uint256=>uint256) public roomToMaxTime;
    mapping(address=>uint256[]) public listenerToAllRooms;
    mapping(uint256=>address[]) public roomToHandsRaised;
    mapping(uint256=>bool) public idToRoomOpen;
    mapping(uint256=>uint256) public idToRoomCloseByTime;
    mapping(uint256=>uint256) public nftToTransfers;
    mapping(uint256=>bool) public canTransfer;
    mapping(uint256=>uint256) public roomToPayDate;
    mapping(uint256=>uint256) public roomToNFTToJoin;
    mapping(uint256=>uint256) public nftToStreamTime;
    mapping(address=>uint256) public addressToTEAPASSLIMIT;

    address public TEA = 0x044B2F4d2F37CbD4bf955E1E2B0041dc3fC8e022;
    address public NFTEA = 0x044B2F4d2F37CbD4bf955E1E2B0041dc3fC8e022;
    uint256 public rate = 10000*10**9;
    uint256 public roomId;
    uint256 public penalty = rate.mul(1000000000);
    address public operations;


    constructor()  {

        roomId = 0;
        isAdmin[msg.sender] = true;

    }

    receive () external payable {

    }

    function SETROOM(uint256 _fee, address[] memory _cohosts, string memory _info, string memory _title,uint256 _nft, string memory _category) public{

       require(IERC20(TEA).balanceOf(msg.sender)>=penalty,' You must have TEA tokens to host a room');

        roomId = SafeMath.add(roomId,1);

        uint256 h = addressToTEAPASSLIMIT[msg.sender];
        if(h<30){
          h=30;
          }
        uint256 _end = DateTime.addMinutes(block.timestamp,h);
        uint256 _start = block.timestamp + 3 minutes;

        ROOMS memory save = ROOMS({

          id:roomId,
          host: msg.sender,
          fee: _fee,
          start: _start,
          stop: _end,
          info: _info,
          title: _title,
          earnings: 0,
          paid:false,
          rate:0,
          timePay:0,
          category:_category

        });

        roomToCoHosts[roomId] = _cohosts;

        roomToNFTToJoin[roomId]=_nft;
        idToRoom[roomId] = save;
        hostToRoom[msg.sender][roomId] = save;
        hostToAllRooms[msg.sender].push(roomId);
        roomToMaxTime[roomId] =_end;
        idToRoomOpen[roomId] = true;
        idToRoomCloseByTime[roomId] = block.timestamp + 180 minutes;
        emit roomOpen(roomId, msg.sender);

    }

    function CONNECTPASS(uint256 _room) public{

      require(idToRoomOpen[_room], 'this room is closed');
      require(listenerToRoom[msg.sender]!=_room, 'you are already in this room');

      uint256 _inRoom = listenerToRoom[msg.sender];
      if(_inRoom>0 && idToRoom[_room].stop < block.timestamp){

       SETDISCONNECT(_room,0);

      }else{

        listenerToRoom[msg.sender] = _room;
        roomToListeners[_room].push(msg.sender);
        listenerToRoomToStartTime[msg.sender][_room] = block.timestamp;
        listenerToRoomToPayment[msg.sender][_room] = 0;
        listenerToAllRooms[msg.sender].push(_room);

        emit passConnected(_room, msg.sender);

     }
    }

    function SETDISCONNECT(uint256 _room,uint256 _index) public returns(bool){

      require(listenerToRoom[msg.sender] == _room, ' you are not in this room');
      uint256 roomTime = block.timestamp.sub(listenerToRoomToStartTime[msg.sender][_room]);
      uint256 maxTime = idToRoom[_room].stop.sub(idToRoom[_room].start);

      if(roomTime>maxTime){

        roomTime = idToRoom[_room].stop.sub(listenerToRoomToStartTime[msg.sender][_room]);

      }else{

        roomTime = block.timestamp.sub(listenerToRoomToStartTime[msg.sender][_room]);

      }

      uint256 hostPay = roomTime.mul(rate).div(60);
      listenerToRoomToPayment[msg.sender][_room] = hostPay;
      listenerToRoomToEndTime[msg.sender][_room] = block.timestamp;
      hostToTotalEarned[idToRoom[_room].host] = hostToTotalEarned[idToRoom[_room].host].add(hostPay);
      roomToEarnings[_room] = roomToEarnings[_room].add(hostPay);
      listenerToRoom[msg.sender] = 0;
      delete roomToListeners[_room][_index];
      emit roomExit(_room, msg.sender);
      return true;
    }

    function SETRAISEHAND(uint256 _room) public returns(bool){

      uint256 _value = idToRoom[_room].fee;
      require(IERC20(TEA).balanceOf(msg.sender)>=_value,' You must have enough to cover the question fee');
      require(idToRoomOpen[_room], 'this room is closed');
      bool success = true;

      if(roomToNFTToJoin[_room]>0){

        require(IERC1155(NFTEA).balanceOf(msg.sender,roomToNFTToJoin[_room])>0, 'you do not own the nft needed to join');

      }else if(_value>0){

        success = IERC20(TEA).transferFrom(msg.sender,address(this),_value);
      }

      if(success){

        roomToHandsRaised[_room].push(msg.sender);
        hostToTotalEarned[idToRoom[_room].host] = hostToTotalEarned[idToRoom[_room].host].add(_value);
        listenerToTotalPayment[msg.sender]= listenerToTotalPayment[msg.sender].add(_value);
        roomToEarnings[_room]= roomToEarnings[_room].add(_value);
        listenerToRoomToPayment[msg.sender][_room] = _value;
        IERC1155(NFTEA).SET_POWER_UP(msg.sender,2);

        emit handRaised(_room,msg.sender);
        return true;

      }else{

        return false;
      }


    }

    function SETCLOSEROOM(uint256 _room) public{

      require(idToRoom[_room].host == msg.sender, ' you are not the host');
      if(idToRoomCloseByTime[_room]<block.timestamp){

        bool success = IERC20(TEA).transferFrom(idToRoom[_room].host,address(this),penalty);
        if(success){

          PAYHOSTS(_room);

        }

      }else{

        PAYHOSTS(_room);

        idToRoomOpen[_room] = false;
        if(hostToAllRooms[msg.sender].length % 20 == 0 && addressToTEAPASSLIMIT[msg.sender] <240){
          addressToTEAPASSLIMIT[msg.sender] = addressToTEAPASSLIMIT[msg.sender].add(30);
        }

      }
    }

    function PAYHOSTS(uint256 _room) private returns(bool){

      require(!idToRoom[_room].paid, 'earnings already paid');
      uint256 total = roomToCoHosts[_room].length;
      uint256 serviceFee = roomToEarnings[_room].mul(3).div(100);
      total = total.sub(serviceFee);
      uint256 split = roomToEarnings[_room].div(total);

      IERC20(TEA).transfer(operations,serviceFee);

      for (uint256 i = 0; i < roomToCoHosts[_room].length; i++) {

        IERC20(TEA).transfer(roomToCoHosts[_room][i],split);
        IERC1155(NFTEA).SET_POWER_UP(roomToCoHosts[_room][i],3);

      }

      idToRoomOpen[_room] = false;
      idToRoom[_room].paid = true;
      roomToPayDate[_room] = block.timestamp;
      emit roomClosed(_room, msg.sender);
      return true;

    }

    function PAYTEAPASS(uint256 _room, uint256 _nft) public returns(bool){

      require(idToRoom[_room].host==msg.sender, 'you are not the host');
      uint256 totalTime = 0;

      for (uint256 i = 0; i < roomToListeners[_room].length; i++) {
        address participants = roomToListeners[_room][i];
        if(listenerToRoomToEndTime[participants][_room]==0){
          listenerToRoomToEndTime[participants][_room] = idToRoom[_room].stop;
        }
        uint256 time = listenerToRoomToEndTime[participants][_room].sub(listenerToRoomToStartTime[participants][_room]);
        totalTime.add(time);
      }

      totalTime = totalTime.div(60);
      uint256 timePay = totalTime.mul(rate);
      idToRoom[_room].rate = rate;
      idToRoom[_room].timePay = timePay;
      IERC1155(NFTEA).SET_DISVALUE_PARTNERS(_nft,timePay,TEA);
      return true;
    }

    function SETADMIN(address _user) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      if(isAdmin[_user]){

        isAdmin[_user] = false;
      }else{
        isAdmin[_user] = true;
      }
      return true;
    }

    function SETTEA(address _TEA,address _NFTEA) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      TEA = _TEA;
      NFTEA = _NFTEA;
      return true;
    }

    function SETPASSLIMIT(address _user,uint256 _time) public returns(bool){

      require(isAdmin[msg.sender], 'you are not an admin');
      addressToTEAPASSLIMIT[_user] = _time;
      return true;
    }

    function withdraw() public returns(bool){

      require(isAdmin[msg.sender], ' you are not an admin');
      uint256 bal = IERC20(TEA).balanceOf(address(this));
      IERC20(TEA).transfer(operations,bal);

      return true;

    }

    function GET_HOST_ROOMS(address _host) public view returns(uint256[] memory){

      return hostToAllRooms[_host];
    }

    function GET_RAISED_HANDS(uint256 _room) public view returns(address[] memory){

      return roomToHandsRaised[_room];
    }

    function GET_LISTENERS(uint256 _room) public view returns(address[] memory){

      return roomToListeners[_room];
    }
    function GET_LISTENER_ROOMS(address _listener) public view returns(uint256[] memory){

      return listenerToAllRooms[_listener];
    }
    function SET_RATE(uint256 _rate) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      rate = _rate * 10**9;
      penalty = rate.mul(1000000000);
      return true;
    }
    function SET_OPERATIONS(address _address) public returns(bool){
      require(isAdmin[msg.sender], 'you are not an admin');
      operations = _address;
      return true;
    }

}
