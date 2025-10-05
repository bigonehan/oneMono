# Overview
This monorepo manages applications (App) and reusable libraries (Packages) separately. All business logic is encapsulated within the pure Domain layer, following the principles of Hexagonal Architecture.

Core Technology Stack
Area

Technology

build : turborepo, pnpm
Backend/Logic : Effect TS, Encore.ts
Frontend : React, Astro

# guide
Hexagonal Architecture: Ensures all domain logic remains independent of external infrastructure (DB, HTTP).

Effect TS: Enables writing type-based, predictable code for asynchronous operations and error handling.

# Structure and Configuration Reference
Please refer to the file below for the detailed structure specification of the monorepo's workspaces (Apps, Packages) and their respective roles.

➡️ Detailed Structure Specification Link


# Configuration
- Common configuration files are located in the packages/config folder.
packages/config/tsconfig: TypeScript configuration inherited by all workspaces.
packages/config/eslint: Defines common ESLint rules.
- New workspaces must be configured to inherit these common settings.
## Monorepo Package Naming Convention
I want to import our internal packages without the `@repo/` prefix.  
Instead of:

```ts
import { Button } from "@repo/ui";
import { getUser } from "@repo/domain";
```
we should be able to write:

```ts
import { Button } from "@ui/button";
import { getUser } from "@domain/user";
```

Iterate over all packages/*/package.json files and follow the naminig convention
## Using template 
when build the app, using `gen` commands , follow the instruction 

https://turborepo.com/docs/guides/generating-code
# Task 
Refer to the following for the file structure.

@./.gemini/structure.md

1. define file structure and follow the gemini.md in the each packages 
2. after install all the package try to make minimal template in the template folder 
3. minimal/template use react and astro js 
4. minimal/template main page show hello worlg component 
3. after install the minimal template, make app minimal using minimal template
4. after app/minimal import the ui package and show the badge component 
5. app/minimal import the three package and show cube comopent


