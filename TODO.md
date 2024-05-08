# Connect Four

A digital version of the classic game, [Connect 4](https://shop.hasbro.com/en-us/product/the-classic-game-of-connect-4/80FB5BCA-5056-9047-F5F4-5EB5DF88DAF4)

### Style

- [x] margins on the side if narrow enough
- [x] Create and add custom favicon
- [x] make button bar wrap
- [x] change new piece style to rotate number

### AI

- [ ] Add move to look ahead with all chains of forced opponent moves until guaranteed win
- [ ] Add even-odd strategy
- [ ] Add scoring and weighted probability
- [ ] Allow users to design their own AI?
- [ ] Perfect ai

### UX and Interface

- [ ] Make fields tabbable
- [ ] Add toggle for major threat visualization
- [ ] Somehow indicate to user about hotkey features - hotkey list (hotkey: ?)
- [ ] Add way to see description of AI persona
- [ ] Display for whether or not each player can win
- [ ] Visualization for all possible future matches
- [ ] Add about, github links, etc
- [ ] Add minor threat visualization?
- [ ] Go through accessibility checklist
- [x] Allow game log to be pasted in to replicate previous game

### Code Cleanup

- [ ] Move various functions from GameClass to BoardClass
- [ ] Fill in TODO tests
- [ ] Check code coverage for missing tests
- [ ] Address all TODO comments with items in TODO.md
- [ ] Lighthouse checklist?
- [x] Create coord class that handles stringification fns

### Gamification

- [ ] Track wins, losses, draws, types of mistakes?
- [ ] Allow for the creation of multiple human profiles, to allow for better stat tracking
- [ ] Implement custom notes/marking - like manually marking major threats or bad moves
- [ ] Unlock features over time
  - Difficulty levels
  - Visualization tools like major threats
  - Hints/training/coaching
- [ ] AI personification
  - avatars
  - comments/exclamations/taunting
  - personalities/attitudes

### Bugs

- [ ] AI player 2 sometimes goes even after a p1 ai win
- [ ] Scrolling down breaks visuals
  - [ ] Put pieces on entirely different layer
    - get rid of position: fixed - it does not allow scrolling!
    - compressed vertical space very inaccurate - account for button bar?
- [x] Yellow spinning animation not centered
- [x] Major threat indicator for A1 given gamelog D1 d2 D3 d4 E1 d5 C1 b1 F1
- [x] Undo now possible after paste
