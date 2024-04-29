# Connect Four

A digital version of the classic game, [Connect 4](https://shop.hasbro.com/en-us/product/the-classic-game-of-connect-4/80FB5BCA-5056-9047-F5F4-5EB5DF88DAF4)

### Deploy

- [ ] Upload repo to github
- [ ] Publish on pages

### Style

- [ ] Put pieces on entirely different layer
  - get rid of position: fixed - it does not allow scrolling!
  - compressed vertical space very inaccurate - account for button bar?
- [ ] make button bar wrap
- [ ] margins on the side if narrow enough
- [ ] change new piece style to rotate number
  - obvious enough to notice, subtle enough to not be distracting

### AI

- [ ] Add move to look ahead with all chains of forced opponent moves until guaranteed win
- [ ] Add even-odd strategy
- [ ] Add scoring and weighted probability
- [ ] Allow users to design their own AI
- [ ] Perfect ai
  - requires mapping out all winning paths for red
  - requires finding optimal paths for yellow
- [ ] Add AI attitudes, where they will say different things depending on the situation
  - [ ] Coaching/Informative
  - [ ] Taunting/Competetive
  - [ ] Pleasant/Encouraging

### UX and Interface

- [ ] Add toggle for major threat visualization
- [ ] Add about, github links, etc
- [ ] Somehow indicate to user about hotkey feature

### Code Cleanup

- [x] Create coord class that handles stringification fns
