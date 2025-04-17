# Start the Aztec sandbox environment
start-sandbox:
	aztec start --sandbox

# Import pre-funded test accounts into the wallet
import-test-accounts:
	aztec-wallet import-test-accounts

# Create a new local wallet with a given alias
create-wallet alias:
	aztec-wallet create-account -a {{alias}} --payment method=fee_juice,feePayer=test0

# Deploy the example Token contract to the sandbox
deploy-token:
	aztec-wallet deploy TokenContractArtifact --from accounts:test0 --args accounts:test0 TestToken TST 18 -a testtoken

# Mint public tokens to an account (provide amount)
mint-to-public amount:
	aztec-wallet send mint_to_public --from accounts:test0 --contract-address contracts:testtoken --args accounts:test0 {{amount}}

# Check public token balance of test0 account
balance-of-public:
	aztec-wallet simulate balance_of_public --from accounts:test0 --contract-address contracts:testtoken --args accounts:test0

# Transfer tokens from public to private balance (provide amount)
transfer-to-private amount:
	aztec-wallet send transfer_to_private --from accounts:test0 --contract-address contracts:testtoken --args accounts:test0 {{amount}}

# Check private token balance of test0 account
balance-of-private:
	aztec-wallet simulate balance_of_private --from accounts:test0 --contract-address contracts:testtoken --args accounts:test0
