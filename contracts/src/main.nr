use dep::aztec::macros::aztec;
use dep::aztec::prelude::*;

#[aztec]
contract LadderWar {
    struct PlayerState {
        position: u32,
        has_won: bool,
    }

    enum Action {
        Climb,
        Attack,
    }

    #[storage]
    struct Storage<Context> {
        current_turn: PublicMutable<u32, Context>,
        last_action_turn: Map<AztecAddress, PublicMutable<u32, Context>, Context>,
        game_finished: PublicMutable<bool, Context>,
        winner: PublicMutable<AztecAddress, Context>,
        disclosure_flag: PublicMutable<bool, Context>,
        player_states: Map<AztecAddress, PrivateSet<PlayerState, Context>, Context>,
    }

    #[initializer]
    fn start_game(players: [AztecAddress; 3]) {
        for player in players {
            let note = PlayerState { position: 0, has_won: false };
            storage.player_states.at(player).insert(note);
        }

        storage.current_turn.write(0);
        storage.game_finished.write(false);
    }

    #[private]
    fn play_turn(action: Action, target: Option<AztecAddress>) {
        let sender = context.msg_sender();
        let current_turn = storage.current_turn.read();
        let last_turn = storage.last_action_turn.at(sender).read();

        assert(last_turn < current_turn, "Already played this turn");
        assert(!storage.game_finished.read(), "Game has finished");

        let mut state = storage.player_states.at(sender).remove();

        match action {
            Action::Climb => {
                state.position += 1;
            }
            Action::Attack => {
                let victim = target.expect("Target required for attack");
                assert(victim != sender, "Cannot attack yourself");
                let mut target_state = storage.player_states.at(victim).remove();
                target_state.position = target_state.position.saturating_sub(1);
                storage.player_states.at(victim).insert(target_state);
            }
        }

        storage.player_states.at(sender).insert(state);
        storage.last_action_turn.at(sender).write(current_turn);
    }

    #[public]
    fn advance_turn() {
        let players = storage.player_states.keys();
        let current_turn = storage.current_turn.read();

        for player in players {
            let turn = storage.last_action_turn.at(player).read();
            assert(turn == current_turn, "Not all players have moved");
        }

        storage.current_turn.write(current_turn + 1);

        if (current_turn + 1) % 5 == 0 {
            let mut disclosure = false;
            for player in players {
                let state = storage.player_states.at(player).view();
                if state.position >= 15 {
                    disclosure = true;
                }
            }
            storage.disclosure_flag.write(disclosure);
        }
    }

    #[private]
    fn claim_victory() {
        let sender = context.msg_sender();
        let mut state = storage.player_states.at(sender).remove();

        assert(state.position >= 20, "Not enough progress");
        assert(!storage.game_finished.read(), "Already claimed");

        state.has_won = true;

        storage.player_states.at(sender).insert(state);
        storage.game_finished.write(true);
        storage.winner.write(sender);
    }

    #[public]
    fn get_current_turn() -> u32 {
        storage.current_turn.read()
    }

    #[public]
    fn get_disclosure_flag() -> bool {
        storage.disclosure_flag.read()
    }

    #[public]
    fn get_winner() -> AztecAddress {
        storage.winner.read()
    }
}
