# Start the Aztec sandbox environment
start-sandbox:
	aztec start --sandbox

# Import pre-funded test accounts into the wallet
import-test-accounts:
	aztec-wallet import-test-accounts

# Create a new local wallet with a given alias
create-wallet alias:
	aztec-wallet create-account -a {{alias}} --payment method=fee_juice,feePayer=test0

# Deploy the Ladder War contract
deploy-ladder-war:
	aztec-wallet deploy LadderWarContractArtifact --from accounts:test0 -a ladderwar

# Play a turn (you must pass action enum and optional target)
# action = "climb" or "attack"
play-turn action target?:
	aztec-wallet send play_turn --from accounts:test0 --contract-address contracts:ladderwar --args {{action}} {{target}}

# Advance to the next turn (can be called when all players played)
advance-turn:
	aztec-wallet send advance_turn --from accounts:test0 --contract-address contracts:ladderwar

# Check the disclosure flag (if someone is close to winning)
check-disclosure:
	aztec-wallet simulate get_disclosure_flag --from accounts:test0 --contract-address contracts:ladderwar

# Claim victory if player reached step 20
claim-victory:
	aztec-wallet send claim_victory --from accounts:test0 --contract-address contracts:ladderwar

# Simulate reading the current turn
current-turn:
	aztec-wallet simulate get_current_turn --from accounts:test0 --contract-address contracts:ladderwar
