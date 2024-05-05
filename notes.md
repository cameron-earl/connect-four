### Brute Force Analysis

- Go until game over state
  - player can win
  - other player can win in two places
  - can create imminent combinatoric trap
  - stalemate inevitable, no more possible wins for anyone

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
- contributes to a later trap
- creates inaccessible major threats with a non-matching parity (red odd, yellow even)
- creates inaccessible major threats
- contributes to many possible future wins
- blocks many possible future losses

### Dev Resources

[Simpler spinning coin animation - implement?](https://codepen.io/keiwo/pen/ZONRgx)
[Implemented spinning coin animation](https://codepen.io/xaelan/pen/wvwPpLa)
[Connect 4 Solver tutorial](http://blog.gamesolver.org/)
