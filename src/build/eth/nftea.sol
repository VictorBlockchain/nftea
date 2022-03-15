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

  function withdrawETH(address _to) external returns(bool);
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
    i1155(address(this)).setApprovalForAll(_creator,true);

    return true;
  }

  function withdrawETH(address _to) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    payable(address(_to)).transfer(address(this).balance);
    return true;
  }

  function withdrawNFT(address _to, uint256 _nft) public returns(bool){
    require(_isC[msg.sender], 'you are not that cool');
    safeTransferFrom(address(this),_nft, _to);
    return true;
  }

  function approve1155(address _contract, address _creator) public returns(bool){

    require(_isC[msg.sender], 'you are not that cool')
    i1155(_contract).setApprovalForAll(_creator,true);

  }

}

contract NFTEA is ERC1155 {
    using SafeMath for uint256;

    struct CONTRACT{

      uint256: _id;
      address: _contract;
      address:_vault;
      uint256: _nft;
      uint256: _brew;

    }
    CONTRACT[] public contracts;
    uint256 public _Rid = 0;
    uint256 public _Nid = 10000;
    uint256 public _Max = 10000;
    uint256 public _Cid = 0;
    uint256 public mintFee = 0;
    address public artist;
    address public burn = 0x000000000000000000000000000000000000dEaD;
    address public DEV = 0x1479aac671bB77d403955f71C6262aFB4e161b8b;
    //pay the developer of this contract

    mapping(address=>bool) public _isA;
    mapping(uint256=>address) public _N2_V;
    mapping(address=>uint256) public _V2_N;
    mapping(uint256=>uint256) public lockExpire;
    mapping(uint256=>string) internal _N2_uri;
    mapping(uint256=>uint256) public _W2_N;
    mapping(uint256=>bool) public isLimited;
    mapping(address=>mapping(uint256=>CONTRACT[])) public _C2_N2_V;


    constructor() ERC1155("https://nftea.app/nft/eth/{id}.json") {

        _isA[msg.sender] =true;
        artist = payable(msg.sender);

    }
    ////external nfts
    function createEXTvault(address _contract, uint256 _nft) public {

      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      _Rid = _Rid.add(1);
      address vault = address(new VAULT(_Rid,'https://null',address(this)));

      CONTRACT memory save = CONTRACT({
        _id:_Cid,
        _contract:_contract,
        _vault:_vault,
        _nft:_nft,
        _brew: block.timestamp;
      });

      _C2_N2_V[_contract][_nft] = save;

    }

    function getEXTvault(address _contract, uint256 _nft) public returns(CONTRACT[] memory){

        return _C2_N2_V[_contract][_nft];
    }

    function emptyEXTvault(address _contract, uint256 _nft) public {

      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, ' you do not own this nft')
      require(block.timestamp> _C2_N2_V[_contract][_nft]._brew, 'not time to brew');
      EXT(_C2_N2_V[_contract][_nft]._vault).withdrawETH(msg.sender);

    }

    function approveEXTtoken(address _contract, uint256 _nft, address _token) public {

      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      EXT(_C2_N2_V[_contract][_nft]._vault).approveTransfers(address(this),_token);

    }
    function approveEXTnft(address _contract, uint256 _nft,address _vault) public {
      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, ' you do not own this nft')
      EXT(_C2_N2_V[_contract][_nft]._vault).approve1155(_contract,address(this));
    }
    function withdrawEXTasset(uint256 _nft, address _token, address _contract) public {

      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      address _contract = _C2_N2_V[_contract][_nft]._vault;
      uint256 _bal = IERC20(_token).balanceOf(_contract);
      require(_bal>0,'zero balance in contract');
      require(block.timestamp> _C2_N2_V[_contract][_nft]._brew, 'not time to brew');
      IERC20(_token).transferFrom(_contract,msg.sender,_bal);

    }
    function withdrawEXTnft(uint256 _nft, address _wnft, address _contract, uint256 _quantity) public {

      require(IERC1155(_contract).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      address _vault = _C2_N2_V[_contract][_nft]._vault;
      require(block.timestamp> _C2_N2_V[_contract][_nft]._brew, 'not time to brew');
      IERC1155(_contract).safeTransferFrom(_vault,msg.sender,_wnft,_quantity);

    }
    ///internal nfts
    function mint(string memory _ipfs) public payable {

      _Rid = _Rid.add(1);
      require(_Rid<=_Max, 'max minted');
      if(mintFee>0){

        require(msg.value>=mintFee,'low balance');
        require(msg.sender.balance>=mintFee, 'low balance');
        payable(msg.sender).transfer(msg.value);

      }
      address vault = address(new VAULT(_Rid,_ipfs,address(this)));
      _N2_V[_Rid] = vault;
      _V2_N[vault] = _Rid;
      _mint(msg.sender, _Rid, 1, "");
      _N2_uri[_Rid] = _ipfs;

    }

    function mintLimited(uint256 _quantity, string memory _ipfs) public {

      require(_isA[msg.sender], 'you are not that cool');
      _Nid = _Nid.add(1);
      _mint(msg.sender, _Nid, _quantity, "");
            _N2_uri[_Nid] = _ipfs;
      if(_quantity==1){

        address vault = address(new VAULT(_Nid,_ipfs,address(this)));
        _N2_V[_Nid] = vault;
        _V2_N[vault] = _Nid;

      }else {

        isLimited[_Nid] = true;

      }

    }
    function wrap(uint256 _nft) public {

      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(isLimited[_nft], 'cannot wrap single mints');
      _Nid = _Nid.add(1);
      address vault = address(new VAULT(_Nid,_N2_uri[_nft],address(this)));
      _N2_V[_Nid] = vault;
      _V2_N[vault] = _Nid;
      safeTransferFrom(msg.sender,burn,_nft,1,'');
      _mint(msg.sender, _Nid, 1, "");
      _W2_N[_Nid] = _nft;
      _N2_uri[_Nid] = _N2_uri[_nft];

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
    function unlocketh(uint256 _nft) public {

      uint256 _time = lockExpire[_nft];
      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      require(block.timestamp>_time, 'not time to unlock');
      EXT(_N2_V[_nft]).withdrawETH(msg.sender);

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
      uint256 _bal = address(this).balance;
      uint256 _fee = _bal.mul(2).div(100);
      uint256 _value = _bal.sub(_fee);
      payable(address(msg.sender)).transfer(_value);
      payable(address(DEV)).transfer(_fee);

    }
    function withdrawAsset(uint256 _nft, address _token) public {

      require(balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
      address _contract = _N2_V[_nft];
      uint256 _bal = IERC20(_token).balanceOf(_contract);
      require(_bal>0,'zero balance in contract');
      require(block.timestamp > lockExpire[_nft], 'not time to withdraw');
      IERC20(_token).transferFrom(_contract,msg.sender,_bal);

    }

}
