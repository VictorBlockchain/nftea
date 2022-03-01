// SPDX-License-Identifier: MIT

///this contract allows you to mint NFT's with a vault contract attached to it
//the vault can hold eth and other erc20 tokens, time locked
// the holder of the nft is the only one who can withdraw assets from the attached contract
// @VictorBlokchain on twitter
// tips VictorBlockchain.eth
// $victorblockchain (cashapp)
// nft donations: 0x1479aac671bB77d403955f71C6262aFB4e161b8b

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
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
interface EXT is IERC1155{

  function withdrawBNB(address _to) external returns(bool);
  function approveTransfers(address _creator, address _token) external returns(bool);

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
abstract contract ContextMixin {
    function msgSender()
        internal
        view
        returns (address payable sender)
    {
        if (msg.sender == address(this)) {
            bytes memory array = msg.data;
            uint256 index = msg.data.length;
            assembly {
                // Load the 32 bytes word from memory with the address on the lower 20 bytes, and mask those.
                sender := and(
                    mload(add(array, index)),
                    0xffffffffffffffffffffffffffffffffffffffff
                )
            }
        } else {
            sender = payable(msg.sender);
        }
        return sender;
    }
}
contract VAULT {

  uint256 nft;
  string ipfs;

  mapping(address=>bool) internal _isC;

  constructor(uint256 _nft, string memory _ipfs, address _creator){

    nft = _nft;
    ipfs = _ipfs;
    _isC[_creator] = true;

  }
  receive () external payable {

  }

  function approveTransfers(address _creator, address _token) public returns(bool) {

    require(_isC[msg.sender], 'you are not that cool');
    IERC20(_token).approve(_creator,100000000000000000000000000000000000000000);
    return true;
  }

  function withdrawBNB(address _to) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    payable(address(_to)).transfer(address(this).balance);
    return true;
  }

}

contract NFTEA is ERC1155, ContextMixin {
    using SafeMath for uint256;

    uint256 public _Nid = 0;
    uint256 public _Max = 10000;
    string public _IPFS;
    uint256 public mintFee;
    address public artist;
    address public burn = 0x000000000000000000000000000000000000dEaD;

    mapping(address=>bool) public _isA;
    mapping(uint256=>address) public _N2_V;
    mapping(address=>uint256) public _V2_N;
    mapping(uint256=>uint256) public lockExpire;
    mapping(uint256=>string) internal _N2_uri;
    mapping(uint256=>uint256) public _W2_N;
    mapping(uint256=>bool) public isLimited;

    constructor() ERC1155("https://nftea.app/") {

        _isA[msg.sender] =true;
        artist = payable(msg.sender);

    }

    function mint() public payable {

      _Nid = _Nid.add(1);
      require(_Nid<=_Max, 'max minded');
      require(msg.value>=mintFee,'low balance');
      require(msg.sender.balance>=mintFee, 'low balance');
      payable(msg.sender).transfer(msg.value);

      address vault = address(new VAULT(_Nid,_IPFS,address(this)));
      _N2_V[_Nid] = vault;
      _V2_N[vault] = _Nid;
      _mint(msg.sender, _Nid, 1, "");
      _N2_uri[_Nid] = _IPFS;

    }
    function mintLimited(uint256 _quantity, string memory _ipfs) public {

      require(_isA[msg.sender], 'you are not that cool');
      _Nid = _Nid.add(1);
      _mint(msg.sender, _Nid, _quantity, "");
      _N2_uri[_Nid] = _ipfs;
      isLimited[_Nid] = true;

    }
    function wrap(uint256 _nft) public {

      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(isLimited[_nft], 'cannot wrap single mints');
      address vault = address(new VAULT(_Nid,_IPFS,address(this)));
      _N2_V[_Nid] = vault;
      _V2_N[vault] = _Nid;
      safeTransferFrom(msg.sender,burn,_nft,1,'');
      _mint(msg.sender, _Nid, 1, "");
      _W2_N[_Nid] = _nft;
      _N2_uri[_Nid] = _N2_uri[_nft];

    }
    function setIPFS(string memory  _ipfs) public {

      require(_isA[msg.sender], 'you are not that cool');
      _IPFS= _ipfs;

    }
    function setMintFee(uint256 _value) public {

      require(_isA[msg.sender], 'you are not that cool');
      mintFee = _value;

    }
    function lock(uint256 _nft, uint256 _time) public {

      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(block.timestamp<_time, 'lock date must be in the future');
      lockExpire[_nft] = _time;

    }
    function unlockbnb(uint256 _nft) public {

      uint256 _time = lockExpire[_nft];
      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(block.timestamp>_time, 'not time to unlock');
      EXT(_N2_V[_nft]).withdrawBNB(msg.sender);

    }
    function unlocktoken(uint256 _nft, address _token) public {

      uint256 _time = lockExpire[_nft];
      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(block.timestamp>_time, 'not time to unlock');
      uint256 balance = IERC20(_token).balanceOf(_N2_V[_nft]);
      IERC20(_token).transferFrom(_N2_V[_nft],msg.sender,balance);

    }

    function approvetoken(uint256 _nft, address _token) public {

      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      EXT(_N2_V[_nft]).approveTransfers(address(this),_token);

    }

    function tokenURI(uint256 _tokenId) public view returns (string memory) {

      return _N2_uri[_tokenId];

    }
    function withdrawEarnings() public {

      require(_isA[msg.sender], 'you are not that cool');
      payable(address(msg.sender)).transfer(address(this).balance);

    }
    function isApprovedForAll(
        address _owner,
        address _operator
    ) public override view returns (bool isOperator) {
        // if OpenSea's ERC1155 Proxy Address is detected, auto-return true
       if (_operator == address(0x207Fa8Df3a17D96Ca7EA4f2893fcdCb78a304101)) {
            return true;
        }
        // otherwise, use the default ERC1155.isApprovedForAll()
        return ERC1155.isApprovedForAll(_owner, _operator);
    }

}
