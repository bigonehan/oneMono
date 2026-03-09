# info
name: template/web
description: monorepo template package
spec: add clicker game scaffold
goal: create game folder with next-zustand-three and game domain lifecycle

# rules
- keep minimal implementation without unrelated refactor
- character input type is click only

# constraints
- use Next + Zustand + Three
- provide `@domains/game` with system and stage object
- stage lifecycle must include load/start/end

# features
- create-clicker-game: add `game` app with clicker base scene
- load-game-system: implement system load/start flow
- manage-game-stage: implement stage load/start/end and character ownership
- move-character-click: character accepts click input only and updates position/click count
- add-character-usecase: character movement update must be delegated to a dedicated usecase file in character folder
