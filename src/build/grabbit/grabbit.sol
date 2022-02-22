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
    function GET_HERITAGE(address _address) external returns(uint256);
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


contract GRABBIT{

  using SafeMath for uint256;

  event gameCreated(
      address _host,
      uint256 _game,
      string _title
  );
  event gameEnded(
      address _host,
      uint256 _game,
      address _winner,
      address _validator
  );
    event newPlayer(

      address _player,
      uint256 _game
  );

  struct GAME{

    uint256 game;
    address host;
    uint256 entryFee;
    uint256 sato;
    uint256 start;
    uint256 maxPlayers;
    address winner;
    address validator;
    string title;
    uint256 value;
    bool started;
    address token;
    uint256 nft;
    uint256 payout;

   }
   GAME[] public games;
   GAME[] public activeGames;

   struct PLAYER{

     address player;
     uint256 game;
   }
   PLAYER[] public players;

  mapping(address=>bool) public isAdmin;
  mapping(address=>bool) public isSuperAdmin;
  mapping(address=>bool) public isValidator;
  mapping(uint256=>GAME) public idToGame;
  mapping(uint256=>PLAYER[]) public gameToPlayers;
  mapping(address=>GAME[]) public hostToGames;
  mapping(address=>GAME[]) public playerToWins;
  mapping(uint256=>uint256) public gameToPayoutTime;
  mapping(address=>bool) public isBanned;
  mapping(uint256=>uint256) internal gameToIndex;
  mapping(address=>mapping(uint256=>uint256)) internal playerToGameToIndex;
  mapping(uint256=>uint256) public timeToWithdraw;
  mapping(address=>uint256) public playerToGame;
  mapping(uint256=>uint256) public gameToHostEarnings;
  mapping(uint256=>uint256) public gameToValidatorEarnings;
  mapping(address=>bool) public validatorOnline;
  mapping(address=>uint256) public validatorInsurance;
  mapping(address=>uint256) public validatorToEarnings;
  mapping(address=>uint256) public hostToEarnings;

  uint256 internal game_id;
  address public HONEYPOT;
  address public SATO;
  address internal FEEADDRESS;
  uint256 public VALIDATORINSURANCE;
  uint256 internal VFEE;
  uint256 internal FEE;

    constructor(){

      game_id = 0;
      isAdmin[msg.sender] = true;
      isSuperAdmin[msg.sender] = true;
      isValidator[msg.sender] = true;

    }

    receive () external payable {}

    function onERC1155Received(
          address,
          address,
          uint256,
          uint256,
          bytes memory
      ) public virtual returns (bytes4) {
          return this.onERC1155Received.selector;
      }

      function onERC1155BatchReceived(
          address,
          address,
          uint256[] memory,
          uint256[] memory,
          bytes memory
      ) public virtual returns (bytes4) {
          return this.onERC1155BatchReceived.selector;
      }

  function SET_GAME(string memory _title, uint256 _nft, address _token,uint256 _entry, uint256 _sato, uint256 _start, uint256 _maxPlayers, uint256 _value) public{
    require(!isBanned[msg.sender], 'you are banished');

    if(_nft>0){

      require(IERC1155(HONEYPOT).balanceOf(msg.sender,_nft)>0, ' you do not own this nft');
      IERC1155(HONEYPOT).safeTransferFrom(msg.sender,address(this),_nft,1,'');
      IERC1155Receiver(address(this)).onERC1155Received(HONEYPOT,msg.sender,_nft,1,'');

    }else{

      require(IERC20(SATO).balanceOf(msg.sender)>_value);
      IERC20(_token).transferFrom(msg.sender,address(this), _value);
      require(checkSuccess(), "auction create token transfer failed");

    }

    game_id = SafeMath.add(game_id,1);

    GAME memory save = GAME({
      game:game_id,
      host:msg.sender,
      entryFee: _entry,
      sato: _sato,
      start: _start,
      maxPlayers: _maxPlayers,
      winner: msg.sender,
      validator: msg.sender,
      title:_title,
      value: _value,
      started: false,
      token:_token,
      nft:_nft,
      payout:0
    });
    idToGame[game_id] = save;
    hostToGames[msg.sender].push(save);
    games.push(save);
    activeGames.push(save);
    gameToIndex[game_id] = activeGames.length;
    gameToPayoutTime[game_id] = 0;
    emit gameCreated(msg.sender,game_id,_title);

  }

  function GET_HOSTGAMES(address _host) public view returns(GAME[] memory){
    return hostToGames[_host];
  }

  function GET_GAME(uint256 _game) public view returns(GAME memory){
    return idToGame[_game];
  }

  function GET_ACTIVEGAMES() public view returns(GAME[] memory){

    return activeGames;

  }

  function SET_ENDGAME(address _winner, uint256 _game) public{

    require(idToGame[_game].host ==msg.sender || isValidator[msg.sender], 'you are not the host of this game or a validator');
    require(playerToGame[_winner]==_game, 'winner is not seated in this game');
    require(!isBanned[msg.sender], 'you are banned');

    idToGame[_game].winner = _winner;
    idToGame[_game].validator = msg.sender;

      if(idToGame[_game].entryFee>0 && idToGame[_game].nft<1){

        address _token = idToGame[_game].token;
        uint256 totalPlayers = gameToPlayers[_game].length;
        uint256 totalEntry = totalPlayers.mul(idToGame[_game].entryFee);
        uint256 vPay = totalEntry.mul(VFEE).div(100);
        uint256 value = totalEntry.sub(vPay);
        uint256 fee = value.mul(FEE).div(100);
        uint256 hostPay = value.sub(fee).sub(idToGame[_game].value);
        uint256 payout = value.sub(hostPay);
        idToGame[_game].payout = payout;
        gameToHostEarnings[_game] = value;
        gameToValidatorEarnings[_game] = fee;
        hostToEarnings[idToGame[_game].host].add(hostPay);
        validatorToEarnings[msg.sender].add(vPay);


        IERC20(_token).transferFrom(address(this),msg.sender, vPay);
        require(checkSuccess(), "auction create token transfer failed");
        IERC20(_token).transferFrom(address(this),FEEADDRESS, fee);
        require(checkSuccess(), "auction create token transfer failed");
        IERC20(_token).transferFrom(address(this),idToGame[_game].host, hostPay);
        require(checkSuccess(), "auction create token transfer failed");
        IERC1155(HONEYPOT).SET_POWER_UP(idToGame[_game].validator,1);
        IERC1155(HONEYPOT).SET_POWER_UP(idToGame[_game].host,1);
      }

    timeToWithdraw[_game] = block.timestamp + 10 minutes;
    uint256 index = gameToIndex[_game];
    delete activeGames[index];
    emit gameEnded(idToGame[_game].host, _game, _winner, msg.sender);
  }

  function SET_WINNER(address _winner, uint256 _game) public{

    require(isSuperAdmin[msg.sender], 'you are not an admin');
    idToGame[_game].winner = _winner;
    idToGame[_game].validator = msg.sender;

  }

  function DELETE_GAME(uint256 _game) public{

    require(idToGame[_game].host ==msg.sender, 'you are not the host of this game');
    require(idToGame[_game].winner==msg.sender, 'this game has a winner');

    uint256 value = idToGame[_game].value;
    address _token = idToGame[_game].token;
    if(idToGame[_game].nft<1){

      IERC20(_token).transferFrom(address(this),msg.sender, value);
      require(checkSuccess(), "token withdraw failed");

    }else{

      IERC1155(HONEYPOT).safeTransferFrom(address(this),msg.sender,idToGame[_game].nft,1,'');
      require(checkSuccess(), "nft withdraw failed");
    }
    uint256 index = gameToIndex[_game];
    delete activeGames[index];


  }

  function SET_PLAYER(uint256 _game) public{

    require(!idToGame[_game].started, 'game already started');
    uint256 _oldGame = playerToGame[msg.sender];
    if(_oldGame>0 && idToGame[_oldGame].host!=idToGame[_oldGame].winner){
        _oldGame = 0;
    }
    require(_oldGame<1,'you are seated in another game');
    require(msg.sender!=idToGame[_game].host,'cannot join your own game');
    require(!validatorOnline[msg.sender], 'go offline as validator to play');

    if(idToGame[_game].sato>0){

      require(IERC20(SATO).balanceOf(msg.sender)>idToGame[_game].sato, 'your are holiding is little sato to join');

    }else if(idToGame[_game].entryFee>0){

          require(IERC20(SATO).balanceOf(msg.sender)>idToGame[_game].entryFee, 'your balance is too low to join');
          IERC20(SATO).transferFrom(msg.sender,address(this), idToGame[_game].entryFee);
          require(checkSuccess(), "token withdraw failed");

    }
        PLAYER memory save = PLAYER({
          player: msg.sender,
          game:_game
        });
        gameToPlayers[_game].push(save);
        playerToGameToIndex[msg.sender][_game] = gameToPlayers[_game].length;
        playerToGame[msg.sender] = _game;
        if(gameToPlayers[_game].length>=idToGame[_game].maxPlayers){
          idToGame[_game].started = true;
        }
        emit newPlayer(msg.sender,_game);
  }

  function SET_WITHDRAW_PLAYER(uint256 _game) public{

    require(!idToGame[_game].started, 'game already started');
    require(playerToGame[msg.sender]==_game, 'you are not seated in this game');
    uint256 index = playerToGameToIndex[msg.sender][_game];

    if(idToGame[_game].entryFee>0){

      IERC20(SATO).transferFrom(address(this),msg.sender, idToGame[_game].entryFee);
      require(checkSuccess(), "token withdraw failed");

    }
    playerToGame[msg.sender] = 0;
    delete gameToPlayers[_game][index];

  }

  function GET_PLAYERS(uint256 _game) public view returns(PLAYER[] memory){
    return gameToPlayers[_game];
  }

  function SET_WITHDRAW(uint256 _game) public{

    require(idToGame[_game].winner == msg.sender, ' you are not the winner');
    require(timeToWithdraw[_game]<block.timestamp, 'not time to withdraw');
    require(gameToPayoutTime[_game]<1, 'already withdrawn');

    uint256 value = idToGame[_game].payout;
    address _token = idToGame[_game].token;
    if(idToGame[_game].nft<1){

      IERC20(_token).transferFrom(address(this),msg.sender, value);
      require(checkSuccess(), "token withdraw failed");

    }else{

      IERC1155(HONEYPOT).safeTransferFrom(address(this),msg.sender,idToGame[_game].nft,1,'');
      require(checkSuccess(), "nft withdraw failed");
    }
    gameToPayoutTime[_game] = block.timestamp;
    IERC1155(HONEYPOT).SET_POWER_UP(msg.sender,1);
  }

  function SET_HONEYPOT(address _addy) public{
    require(isAdmin[msg.sender], 'you are not an admin');
    HONEYPOT = _addy;
  }
  function SET_SATO(address _addy) public{
    require(isAdmin[msg.sender], 'you are not an admin');
    SATO = _addy;
  }
  function SET_FEEADDRESS(address _addy) public{
    require(isAdmin[msg.sender], 'you are not an admin');
    FEEADDRESS = _addy;
  }
  function SET_ADMIN(uint256 _type) public{
    require(isAdmin[msg.sender], 'you are not an admin');

    if(_type==1){
      if(isAdmin[msg.sender]){
        isAdmin[msg.sender] = false;
      }else{
        isAdmin[msg.sender] = true;
      }
    }else{
      if(isSuperAdmin[msg.sender]){
        isSuperAdmin[msg.sender] = false;
      }else{
        isSuperAdmin[msg.sender] = true;
      }
    }
  }
  function SET_BANN(address _user) public{

    require(isAdmin[msg.sender], 'you are not an admin');
    if(isBanned[_user]){
        isBanned[_user] = false;
    }else{
        isBanned[_user] = true;
    }
  }
 function SET_VALIDATOR_ONLINE() public{
     require(isValidator[msg.sender], 'you are not a validator');
     if(validatorOnline[msg.sender]){
         validatorOnline[msg.sender] = false;
     }else{
         validatorOnline[msg.sender] = true;
     }
  }

  function SET_VALIDATOR() public{

     require(IERC20(SATO).balanceOf(msg.sender)>VALIDATORINSURANCE, 'your balance is too low to cover the insurance');
      IERC20(SATO).transferFrom(msg.sender,address(this), VALIDATORINSURANCE);
      require(checkSuccess(), "validator set failed");
      validatorInsurance[msg.sender] = VALIDATORINSURANCE;
      isValidator[msg.sender] = true;

  }
  function SET_ENDVALIDATOR(address _validator,uint256 _admin) public{

      if(_admin>0){

          require(isAdmin[msg.sender], 'you are not an admin');
          require(validatorInsurance[_validator]>0,'you have zero insurace');
          IERC20(SATO).transferFrom(address(this),FEEADDRESS, VALIDATORINSURANCE);
          require(checkSuccess(), "validator end failed");
          validatorInsurance[_validator] = 0;
          isValidator[_validator] = false;

      }else{

          require(isValidator[msg.sender], 'you are not a validator');
          require(validatorInsurance[msg.sender]>0,'you have zero insurace');
          IERC20(SATO).transferFrom(address(this),msg.sender, VALIDATORINSURANCE);
          require(checkSuccess(), "validator end failed");
          validatorInsurance[msg.sender] = 0;
          isValidator[msg.sender] = false;

      }


  }
 function SET_INSURANCE(uint256 _amount) public{
     require(isSuperAdmin[msg.sender], 'you are not an admin');
     VALIDATORINSURANCE = _amount *10**9;
  }
 function SET_FEE(uint256 _vfee, uint256 _fee) public{
     require(isAdmin[msg.sender], 'you are not an admin');
     VFEE = _vfee;
     FEE = _fee;
  }
  function checkSuccess()
      private pure
      returns (bool)
    {
      uint256 returnValue = 0;

      /* solium-disable-next-line security/no-inline-assembly */
      assembly {
        // check number of bytes returned from last function call
        switch returndatasize()

          // no bytes returned: assume success
          case 0x0 {
            returnValue := 1
          }

          // 32 bytes returned: check if non-zero
          case 0x20 {
            // copy 32 bytes into scratch space
            returndatacopy(0x0, 0x0, 0x20)

            // load those bytes into returnValue
            returnValue := mload(0x0)
          }

          // not sure what was returned: dont mark as success
          default { }

      }

      return returnValue != 0;
    }

}
