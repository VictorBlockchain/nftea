// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
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

    function disValue(address _contract, uint256 _value, address _token) external returns (bool);
    function BURN(uint256 _nft, address _collector) external returns (bool);
}
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

/// @custom:security-contact security@nftea.app
contract TeaPass is Initializable, ERC1155Upgradeable, OwnableUpgradeable, PausableUpgradeable, ERC1155BurnableUpgradeable, ERC1155SupplyUpgradeable, UUPSUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    using SafeMath for uint256;
    constructor() initializer {}
    //_C = collector
    //_H = host
    event collectorAdded(
      address _address,
      uint256 _avatar,
      uint256 _cover,
      uint256 _heritage,
      uint256 _gender
    );
    struct COLLECTOR {

      address _address;
      uint256 _avatar;
      uint256 _cover;
      uint256 _power;
      uint256 _heritage;
      uint256 _gender;

    }
    COLLECTOR[] public collectors;
    mapping(address=>COLLECTOR) public _C;
    mapping(address=>bool) public isA;
    mapping(address=>bool) public isC;
    mapping(address=>address) public _C2_H;
    mapping(address=>mapping(address=>uint256)) public _C2_H_start;
    mapping(address=>mapping(address=>uint256)) public _C2_H_end;
    mapping(address=>bool) public _C2_connected;
    mapping(address=>uint256) public _H2_connected;
    mapping(address=>address[]) public _H2_collectors;
    mapping(address=>mapping(address=>uint256)) public _C2_Hosts;
    mapping(address=>bool) public _H2_allowConnections;
    mapping(address=>uint256) public _H2_nftToConnect;
    mapping(address=>uint256) public _C2_powerUpgradeDate;
    mapping(address=>address[]) public _H2_coHosts;
    mapping(address=>uint256[]) public _H2_coHostSips;

    address public TOKEN = 0x587725fE0EE1d2c8FAF289Bca546B4B54D6c46D6;
    address public TEASHOP = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public NFTEA = 0x1A6508BB74f30c9239B8dB7A4576D7a65E7F0933;
    address public TEAPOT = 0x62cfC9b4C09dA06967418345a1f4bb43EDA54bF0;
    address public burn = 0x000000000000000000000000000000000000dEaD;
    uint256 public powerMul;
    uint256 public upgradePowerNFT;
    uint256 public upgradePower;

    function initialize() initializer public {
        __ERC1155_init("https://nftea.app/nft/{id}.json");
        __Ownable_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __UUPSUpgradeable_init();
        isA[msg.sender] = true;
        upgradePower = 1000000;
        powerMul = 2;
    }

    function allowConnections(uint256 _nft, address[] memory _cohosts, uint256[] memory _sips) public {

      require(_C[msg.sender]._power>=1000000, 'your power is too low');
      require(IERC20(TOKEN).balanceOf(msg.sender)>0, 'your tea balance is too low');
      _H2_allowConnections[msg.sender] = true;
      _H2_nftToConnect[msg.sender] = _nft;
      _H2_coHosts[msg.sender] = _cohosts;
      _H2_coHostSips[msg.sender] = _sips;

    }

    function stopConnections() public {

      uint256[] memory _sips;
      address[] memory _hosts;
      _H2_allowConnections[msg.sender] = false;
      _H2_nftToConnect[msg.sender] = 0;
      _H2_coHosts[msg.sender] = _hosts;
      _H2_coHostSips[msg.sender] = _sips;

    }

    function setProfile(uint256 _avatar, uint256 _cover, uint256 _heritage, uint256 _gender)public {
      require(IERC1155(NFTEA).balanceOf(msg.sender,_avatar)>0,'you do not own this avatar');
      require(IERC1155(NFTEA).balanceOf(msg.sender,_cover)>0, 'you do not own this cover');

      COLLECTOR memory save = COLLECTOR({
        _address:msg.sender,
        _avatar:_avatar,
        _cover:_cover,
        _heritage:_heritage,
        _power:1000,
        _gender:_gender
      });
      _C[msg.sender] = save;
      emit collectorAdded(msg.sender, _avatar, _cover, _heritage, _gender);
    }
    function getProfile(address _collector) public returns(uint256,uint256,uint256,uint256,uint256,uint256){

      return (_C[_collector]._avatar,_C[_collector]._cover,_C[_collector]._heritage,_C[_collector]._power,_C[_collector]._gender);
    }
    function updateProfile(uint256 _avatar, uint256 _cover, uint256 _heritage, uint256 _gender)public {

      require(IERC1155(NFTEA).balanceOf(msg.sender,_avatar)>0,'you do not own this avatar');
      require(IERC1155(NFTEA).balanceOf(msg.sender,_cover)>0, 'you do not own this cover');
      _C[msg.sender]._avatar = _avatar;
      _C[msg.sender]._cover = _cover;
      _C[msg.sender]._heritage = _heritage;
      _C[msg.sender]._gender = _gender;
      emit collectorAdded(msg.sender, _avatar, _cover, _heritage, _gender);

    }
    function setAddress(address _teashop, address _nftea, address _teapot, address _token) public {

        require(isA[msg.sender], 'you are not an admin');
        TEASHOP = _teashop;
        NFTEA = _nftea;
        TEAPOT = _teapot;
        TOKEN = _token;
        isC[NFTEA] = true;
        isC[TEASHOP] = true;
        isC[TEAPOT] = true;

    }
    function setContract(address _contract) public {

        require(isA[msg.sender], 'you are not an admin');
        isC[_contract] = true;

    }
    function setPowerAdmin(uint256 _powermul, uint256 _upgradenft, uint256 _upgradepower) public {

        require(isA[msg.sender], 'you are not an admin');
        powerMul = _powermul;
        upgradePowerNFT = _upgradenft;
        upgradePower = _upgradepower;

    }
    function setPower(address _collector, uint256 _value, uint256 _type) public returns(bool){

      require(isC[msg.sender] || isA[msg.sender], ' you are not that cool');
      if(_type==1){

        _C[_collector]._power = _C[_collector]._power.add(_value);

      }else{

          if(_C[_collector]._power.sub(_value)<0){

            _C[_collector]._power = 0;

          }else{

            _C[_collector]._power = _C[_collector]._power.sub(_value);

          }

      }
      return true;

    }

    function setUpgradePower() public{

      require(IERC1155(NFTEA).balanceOf(msg.sender,upgradePowerNFT)>0, 'you do not own an upgrade nft');
      bool success = IERC1155(NFTEA).BURN(upgradePowerNFT,msg.sender);
      if(success){

        _C[msg.sender]._power = _C[msg.sender]._power.add(upgradePower);

      }

    }

    function connectPass(address _to, address _token) public {

      require(_H2_allowConnections[_to],'this host is not accepting connections');

      if(_H2_nftToConnect[_to]>0){

        require(IERC1155(NFTEA).balanceOf(msg.sender,_H2_nftToConnect[_to])>0,'you do not own the nft required to connect');
      }

      if(_C2_connected[msg.sender]){
        address _host = _C2_H[msg.sender];

        if(_C2_H_end[msg.sender][_host]>block.timestamp){

          _C[msg.sender]._power = _C[msg.sender]._power.sub(1000000);
          _H2_connected[_host] = _H2_connected[_host].sub(1);

        }else{

          uint256 time = _C2_H_end[msg.sender][_host].sub(_C2_H_start[msg.sender][_host]);
          time = time.div(60);
          uint256 _value = _C[msg.sender]._power.mul(powerMul).mul(time);
          uint256 royalty = 0;
          uint256 sip = 0;
          for (uint256 i = 0; i<_H2_coHosts[_host].length; i++){

            if(_H2_coHostSips[_host][i]>0){

            royalty = _value.mul(_H2_coHostSips[_host][i]).div(100);
            sip = _value.sub(royalty);
            bool success =  IERC1155(TEAPOT).disValue(_H2_coHosts[_host][i],sip, _token);
            if(success){
              _C2_Hosts[msg.sender][_H2_coHosts[_host][i]] = _C2_Hosts[msg.sender][_H2_coHosts[_host][i]].add(sip);

            }
            }
          }
           _C2_H[msg.sender] = _to;
           _C2_H_start[msg.sender][_to] = block.timestamp;
           _C2_H_end[msg.sender][_to] = block.timestamp + 2 hours;
           _H2_connected[_to] = _H2_connected[_to].add(1);
        }
      }else{

        _C2_H[msg.sender] = _to;
        _C2_H_start[msg.sender][_to] = block.timestamp;
        _C2_H_end[msg.sender][_to] = block.timestamp + 2 hours;
        _H2_connected[_to] = _H2_connected[_to].add(1);

      }
    }

    function disconnectTeaPass() public{

      require(_C2_connected[msg.sender], 'you tea pass is not connected');

      address _host = _C2_H[msg.sender];
      if(_C2_H_end[msg.sender][_host]>block.timestamp){

        _C[msg.sender]._power = _C[msg.sender]._power.sub(1000000);
        _H2_connected[_host] = _H2_connected[_host].sub(1);

      }else{

        uint256 time = _C2_H_end[msg.sender][_host].sub(_C2_H_start[msg.sender][_host]);
        time = time.div(60);
        uint256 _value = _C[msg.sender]._power.mul(powerMul).mul(time);
        bool success =  IERC1155(TEAPOT).disValue(_C2_H[msg.sender],_value,TOKEN);
        _C2_Hosts[msg.sender][_C2_H[msg.sender]] = _C2_Hosts[msg.sender][_C2_H[msg.sender]].add(_value);

         if(success){

           _C2_H[msg.sender] = burn;
           _C2_H_start[msg.sender][burn] = block.timestamp;
           _C2_H_end[msg.sender][burn] = block.timestamp - 2 hours;
           _H2_connected[_host] = _H2_connected[_host].sub(1);
           _C2_connected[msg.sender] = false;

         }
      }

    }
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account, uint256 id, uint256 amount, bytes memory data)
        public
        onlyOwner
    {
        _mint(account, id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
