// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
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

interface i1155 is IERC1155{

    function disValue(address _contract, uint256 _value, address _token) external returns (bool);
    function setPower(address _user,uint256 _power, uint256 _type) external returns (bool);
    function approveTransfers(address _contract, address _token) external returns(bool);
    function withdrawBNB(address _to) external returns(bool);
    function payArtist(uint256 _nft, uint256 _value) external returns(bool);
    function setVault(uint256 _nft, string memory _ipfs) external returns(address);
    function clearVault(uint256 _nft, uint256 _index) external returns(bool);
    function getProfile(address _collector) external returns(uint256,uint256,uint256,uint256,uint256);

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
contract NFTEA is ERC1155, Ownable, Pausable, ERC1155Burnable, ERC1155Supply {
   using SafeMath for uint256;
    //isA = isAdmin
    //isC = isContract
    //_N = nft
    //_A = album
    //_C = collector
    event newMint(
        address _creator,
        uint256 _nft,
        string _ipfs
    );
    struct ALBUM{

      uint256 _id;
      string _name;
      address _creator;
      uint256 _volume;
      uint256 _floor;
    }
    ALBUM[] public album;

    struct NFT{

        uint256 id;
        uint256 quantity;
        address creator;
        string ipfs;
        uint256 royalty;
        address[] partners;
        uint256[] sips;
        string story;
        uint256 album;
        uint256 mintPass;

    }

    NFT[] public nft;

    mapping(address=>bool) internal isA;
    mapping(address=>bool) public isBA;
    mapping(address=>bool) public isC;
    mapping(uint256=>uint256[]) public _A2_N;
    mapping(uint256=>ALBUM) public _A;
    mapping(uint256=>NFT) public _N;
    mapping(string=>NFT) public ipfs;
    mapping(address=>uint256[]) public _C2_As;
    mapping(address=>uint256[]) public _C2_Ns;
    mapping(address=>uint256[]) public _allAlbums;
    mapping(address=>bool) public BANNED;
    mapping(uint256=>address) public _N2_V;
    mapping(address=>uint256[]) public userToReserveIds;
    mapping(uint256=>uint256) public _WN2_N;
    mapping(uint256=>uint256) public _N2_VOLUME;
    mapping(uint256=>uint256) public _N2_FLOOR;
    mapping(uint256=>bool) public canWrapNFT;
    mapping(uint256=>mapping(address=>uint256)) public reserveIndex;

    address public TEAPOT;
    address public TEAPASS;
    address public TEASHOP;
    address public TOKEN;
    uint256 public _Nid = 0;
    uint256 public _Aid = 0;
    uint256 public mintPoints = 0;
    uint256 public reservePoints = 0;
    uint256 public giftPoints = 0;
    address public burn = 0x000000000000000000000000000000000000dEaD;

    constructor() ERC1155("https://nftea.app/nft/{id}.json") {

        isA[msg.sender] = true;
        isBA[msg.sender] = true;

    }

    function setAlBUM(string memory name) public {

      _Aid = _Aid.add(1);
      ALBUM storage save = _A[_Aid];
      save._id = _Aid;
      save._name = name;
      save._creator = msg.sender;
      _allAlbums[address(this)].push(_Aid);
      _C2_As[msg.sender].push(_Aid);
      album.push(save);
      (uint256 _a,,,,) = i1155(TEAPASS).getProfile(msg.sender);
      if(_a>0){

        i1155(TEAPASS).setPower(msg.sender,5000,1);

      }
    }

    function SET_ADDRESSES(address _token, address _teapot, address _teapass, address _teashop ) public {
      require(isA[msg.sender],'you are not an admin');

            TEAPOT = _teapot;
            TEAPASS = _teapass;
            TOKEN = _token;
            TEASHOP = _teashop;
            isC[TEAPOT] = true;
            isC[TEAPASS] = true;
            isC[TEASHOP] = true;
    }

    function SET_POINTS(uint256 _mint, uint256 _reserve, uint256 _gift) public {
      require(isA[msg.sender],'you are not an admin');
      mintPoints = _mint;
      reservePoints = _reserve;
      giftPoints = _gift;
    }

    function getAlBUM(uint256 _album) public view returns(ALBUM memory){

      return _A[_album];

    }
    function getCollectorAlbums(address _collector) public view returns(uint256[] memory){

      return _C2_As[_collector];

    }
    function getCollectorNfts(address _collector) public view returns(uint256[] memory){

      return _C2_Ns[_collector];

    }

    function getAlBUMS(address _contract) public view returns(uint256[] memory){

      return _allAlbums[_contract];

    }
    function getIPFS(uint256 _nft) public view returns(string memory){

      return _N[_nft].ipfs;

    }
    function getAlbumOfNFT(uint256 _album) public view returns(uint256[] memory){
      return _A2_N[_album];
    }

    function GET_NFT(uint _nft, string memory _ipfs) public view returns (NFT memory) {

        if(_nft>0){

        return _N[_nft];

        }else{

        return ipfs[_ipfs];

        }
    }
    function GET_SIPS(uint _nft) public view returns (address[] memory, uint256[] memory) {

      return (_N[_nft].partners, _N[_nft].sips);

    }
    function SET_ADMIN(address _user, bool _a)public{

       require(isA[msg.sender],'you are not an admin');

        isA[_user] = _a;

    }
    function SET_BA(address _user, bool _a)public{

       require(isA[msg.sender],'you are not an admin');

        isBA[_user] = _a;

    }
    function setContract(address _C, bool _Ad) public {
        require(isA[msg.sender], ' you are not an admin');
                isC[_C] = _Ad;
    }

    function setURI(string memory newuri) public {
        require(isA[msg.sender], 'you are not an admin');
        _setURI(newuri);
    }

    function mint(uint256 amount, bytes memory data, string memory _ipfs,uint256 royalty, address[] memory partners, uint256[] memory sips, string memory story,uint256 _album,address _creator,uint256 _useThisId,uint256 _mintPass,bool _canWrap) public
    {

        require(!BANNED[msg.sender], 'you are banned');


        if(_useThisId<1){

            _Nid = _Nid.add(1);
            _useThisId = _Nid;
            _creator = msg.sender;

        }else{

            require(balanceOf(msg.sender,_mintPass)>0, 'where is your mint pass?');
            require(amount==1, 'you cannot mint more than one regenrative');
            require(reserveIndex[_useThisId][_creator]>0,'invalid reserve id');

        }

        _mint(msg.sender, _useThisId, amount, data);

        NFT memory save = NFT({
            id:_useThisId,
            quantity:amount,
            creator:_creator,
            ipfs:_ipfs,
            royalty:royalty,
            partners:partners,
            sips:sips,
            story:story,
            album:_album,
            mintPass:_mintPass
        });
        nft.push(save);
        _N[_useThisId] = save;
        ipfs[_ipfs] = save;
        _A2_N[_album].push(_useThisId);

        if(amount==1){

          address vault = i1155(TEAPOT).setVault(_useThisId,_ipfs);
          _N2_V[_useThisId] = vault;
          canWrapNFT[_useThisId] = false;

        }
        else{

          canWrapNFT[_useThisId] = _canWrap;

        }
        if(_mintPass>0){

          safeTransferFrom(msg.sender,burn, _mintPass,1,'');

        }
        uint256 _rIndex = reserveIndex[_useThisId][msg.sender];
        if(_rIndex>0){

          userToReserveIds[_creator][_rIndex] = 0;

        }
        (uint256 _a,,,,) = i1155(TEAPASS).getProfile(msg.sender);
        if(_a>0){

        i1155(TEAPASS).setPower(msg.sender,mintPoints,1);
      }
        _C2_Ns[_creator].push(_useThisId);

        emit newMint(_creator,_useThisId,_ipfs);
    }

    function wrap(uint256 _nft, bytes memory data)
        public
    {
        require(i1155(address(this)).balanceOf(msg.sender,_nft)>0, 'you do not own this nft');
        require(canWrapNFT[_nft], 'cannot wrap this nft');
        _Nid = _Nid.add(1);

        address vault = i1155(TEAPOT).setVault(_Nid,_N[_nft].ipfs);
        i1155(address(this)).safeTransferFrom(msg.sender,address(this),_nft,1,'');
        IERC1155Receiver(address(this)).onERC1155Received(address(this),msg.sender,_nft,1,'');
        _WN2_N[_Nid] = _nft;
        _N2_V[_Nid] = vault;
        _C2_Ns[msg.sender].push(_Nid);
        _mint(msg.sender,_Nid,1,data);
    }
    function unwrap(uint256 _wnft) public {

        require(i1155(address(this)).balanceOf(msg.sender,_wnft)>0, 'you do not own this nft');
        uint256 _nft = _WN2_N[_wnft];
        i1155(address(this)).safeTransferFrom(msg.sender,burn,_wnft,1,'');
        require(checkSuccess(), 'error unwrapping');
        i1155(address(this)).safeTransferFrom(address(this),msg.sender,_nft,1,'');
        require(checkSuccess(), 'error unwrapping main nft');

    }

    function setVOLUME(uint256 _nft, uint256 _value) public returns(bool){
      require(isC[msg.sender], 'you are not that cool');
      uint256 _album = _N[_nft].album;
      _A[_album]._volume = _A[_album]._volume.add(_value);
      return true;

    }
    function setFLOOR(uint256 _nft, uint256 _value) public returns(bool){
      require(isC[msg.sender], 'you are not that cool');
      uint256 _album = _N[_nft].album;
      _A[_album]._floor = _value;
      return true;
    }

    function GIFT(uint _nft, address _to, uint256 _quantity) public{

      require(balanceOf(msg.sender,_nft) >=_quantity, 'You do not own this nft');
      i1155(address(this)).safeTransferFrom(msg.sender,_to,_nft,_quantity,'');
      require(checkSuccess(), 'error gifting');

      if(_to!=burn){
        (uint256 _a,,,,) = i1155(TEAPASS).getProfile(msg.sender);
        if(_a>0){

                i1155(TEAPASS).setPower(msg.sender,giftPoints,1);
              }
      }
    }

    function BURN(uint256 _nft, address _collector ) public returns(bool){

      require(balanceOf(_collector,_nft) >0, 'collector does not own this nft');
      require(isC[msg.sender], 'you are not that cool');
      i1155(address(this)).safeTransferFrom(msg.sender,burn,_nft,1,'');
      require(checkSuccess(), 'error burning');
      return true;
    }

    function EDITNFT(uint _nft,string memory _story, uint256 _album) public{

      uint quantity = _N[_nft].quantity;
      require(balanceOf(msg.sender,_nft) == quantity, 'You do not own all these nfts');

      _N[_nft].story = _story;
      _N[_nft].album = _album;
      _N[_nft].quantity = balanceOf(msg.sender,_nft);

    }

    function RESERVEIDS(uint256 _amount) public {
        require(!BANNED[msg.sender], 'you are banned');
        require(userToReserveIds[msg.sender].length<1, 'ids already reserved');

        for (uint256 i = 0; i < _amount; i++) {

            _Nid = _Nid.add(1);
            userToReserveIds[msg.sender].push(_Nid);
            reserveIndex[_Nid][msg.sender] = i;
        }
        (uint256 _a,,,,) = i1155(TEAPASS).getProfile(msg.sender);
        if(_a>0){

        i1155(TEAPASS).setPower(msg.sender,reservePoints, 1);
      }

    }

    function setBan(address _collector) public {
      require(isA[msg.sender], 'you are not an admin');
      BANNED[_collector] = true;
    }

    function GET_RESERVEIDS(address _creator) public view returns(uint256[] memory){

        return userToReserveIds[_creator];

    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public

    {
         require(isBA[msg.sender], ' you are not that cool');
        _mintBatch(to, ids, amounts, data);
    }

    function _beforeTokenTransfer(address operator, address from, address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        internal
        whenNotPaused
        override(ERC1155, ERC1155Supply)
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
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
