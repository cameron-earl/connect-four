# Connect Four

The goal of this project was to create an enjoyable game like the one we all know and love. The AI is moderately challenging, but not advanced. At present, it will block you consistently, make the winning move consistently, and try to make moves which lead to multiple victories, prioritizing short-term victories. There is a chance it will make "mistakes" and pick a sub-optimal move, which makes it feel a bit more human.

### TODO

Features to implement:

- ~~key press for moves and reset~~
- ~~highlight cells that will result in win - with config var for on/off~~
- ~~Dropping animation!~~
- Some indicator for last piece played - pulse? jiggle? rotation?
  rotate number back and forth, subtle
- Undo
- UI Controls:
  - Choose which color goes first
  - ~~beautify reset button~~
  - ~~create dropdowns for players (human and each AI persona)~~
  - swap first and second player button
  - alternate between first and second player between games setting
- ~~Indicator for current player - highlight input area~~
- Keep track of wins, losses, and draws
- Coaching to help the user understand the results of each move

## AI TODO

- create in-game log for ai personas to make comments during certain successful moves
- create different personalities (like condescending, apathetic, timid, etc) and (multiple?) messages for each play and personality
- create avatars and names for each persona?
- ~~create function to evaluate the number of possible wins that cell contributes to, for each player~~
- ~~create modular ai~~
  - ~~a persona can have multiple modules~~
  - ~~modules arranged in a list~~
  - ~~an array of possible moves is fed to the module. it can remove a move if it is bad, or if great moves exist, remove all but them~~
  - it would be good if they could score the moves rather than removing them entirely? 1 for perfect and -1 for sure loss? 0 for meh?
  - ~~persona can have a % chance to ignore advice, to simulate human mistakes~~
  - modules can include:
    - ~~identify available winning move~~
    - ~~identify opponent winning move~~
    - ~~identify moves that enable opponent winning move~~
    - ~~identify which moves are part of the most potential wins~~
    - identify which moves are part of the most potential losses
    - brute force search the next n moves for wins and losses
    - minimax with alpha-beta pruning
- creating combinatoric wins
  - ~~play creates two revealed major threats~~
  - ~~play reveals your major threat while creating a second~~
  - play creates a threat immediately above your existing exclusive threat, or directly below your threat (exclusive or not)
  - play creates a threat which forces a block, which in turn allows a combinatoric trap
- blocking combinatoric traps
  - check the above for the enemy, and play in any one of those spots that does not reveal their major threat
  - alternatively, create your own trap that can be sprung before their potential trap
- evaluate forced moves (moves to avoid loss)
  - if a move forces the opponent into a certain choice, check the results of that forced move
  - if the new game state can be won, make that choice
  - if the new game state has more possible forced moves, evaluate those too

### Brute Force Analysis

- Go until game over state
  - player can win
  - other player can win in two places
  - can create imminent combinatoric trap
  - stalemate inevitable, no more possible wins for anyone

### Resources

[Youtube - 2swap's connect 4 playlist](https://www.youtube.com/playlist?list=PLnAbeiWh6HCrr_2d6oisSsT_zp4O1t9nt)
[Expert Play in Connect 4 (really good glossary)](https://tromp.github.io/c4.html)
[Implemented spinning coin animation](https://codepen.io/xaelan/pen/wvwPpLa)
[Simpler spinning coin animation - implement?](https://codepen.io/keiwo/pen/ZONRgx)

### Interesting Games

- D1 d2 C1 e1 D3 c2 D4 f1 E2 g1 E3 e4 C3 c4 A1 b1 B2 - triple trap!
- D1 g1 D2 f1 F2 e1 E2 g2 E3 g3 G4 f3 F4 c1 C2 - chained trap
- D1 g1 C1 e1 B1 a1 D2 g2 D3 d4 D5 a2 C2 c3 B2 e2 G3 b3 A3 f1 B4 a4 D6 b5 G4 g5 A5 g6 A6 b6 F2 f3 F4 e3 E4 - trap to create trap
- D1 d2 D3 d4 E1 c1 C2 d5 C3 d6 C4 c5 F1 g1 E2 - simple imminent trap that hard should see and block

### Scoring Discussion

What should count toward a score?

- win, nothing should outweigh the value of a win
- blocks an immediate loss
- creates an imminent trap
- blocks an imminent trap
- forces a move which allows creation of an imminent trap
- if win is inevitable given current parity with claimEven/claimOdd strat, following that
- contributes to a later trap // TODO: how to quantify this?
- creates inaccessible major threats with a non-matching parity (red odd, yellow even)
- creates inaccessible major threats
- contributes to many possible future wins
- blocks many possible future losses
