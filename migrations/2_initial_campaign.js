const Campaign = artifacts.require('Campaign')

module.exports = function(deployer) {
  deployer.deploy(Campaign, '', '', 10, '0x9B831015d5d38d0c8b11BA3C22C41B156afb1B03' )
}
