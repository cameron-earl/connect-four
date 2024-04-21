import { moveFns } from '../utilities/aiFns';
import { AiPersona } from './gameModels';

export const aiPersonas: { [key: string]: AiPersona } = {
  easy: {
    name: 'Easy',
    description: 'Will usually go for the win and try to block you from winning. Otherwise, will move randomly.',
    instructions: [
      { chance: 0.8, move: moveFns.win },
      { chance: 0.7, move: moveFns.blockLoss },
      { chance: 0.6, move: moveFns.avoidEnablingLoss },
    ],
  },
  medium: {
    name: 'Medium',
    description: 'Very few mistakes, but very little strategy.',
    instructions: [
      { chance: 1, move: moveFns.win },
      { chance: 1, move: moveFns.blockLoss },
      { chance: 1, move: moveFns.avoidEnablingLoss },
      { chance: 1, move: moveFns.createImmediateTrap },
      { chance: 1, move: moveFns.avoidEnablingImmediateTrap },
      { chance: 1, move: moveFns.enableVerticalTrap },
      { chance: 1, move: moveFns.createVerticalTrap },
      { chance: 1, move: moveFns.avoidEnablingBlock },
    ],
  },
  opportunist: {
    name: 'Opportunist',
    description: 'Maximizes future opportunities to win, but not the best short game.',
    instructions: [
      { chance: 1, move: moveFns.win },
      { chance: 1, move: moveFns.blockLoss },
      { chance: 1, move: moveFns.avoidEnablingLoss },
      { chance: 1, move: moveFns.mostOpportunities },
    ],
  },
  hard: {
    name: 'Hard',
    description: 'No mistakes, strategy, short game, but not perfect either',
    instructions: [
      { chance: 1, move: moveFns.win },
      { chance: 1, move: moveFns.blockLoss },
      { chance: 1, move: moveFns.avoidEnablingLoss },
      { chance: 1, move: moveFns.createImmediateTrap },
      { chance: 1, move: moveFns.avoidEnablingImmediateTrap },
      { chance: 1, move: moveFns.enableVerticalTrap },
      { chance: 1, move: moveFns.createVerticalTrap },
      { chance: 1, move: moveFns.avoidEnablingBlock },
      { chance: 1, move: moveFns.mostOpportunities },
    ],
  },
};
