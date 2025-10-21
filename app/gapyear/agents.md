# definition
- content file placed in `.ai/content`
- define active goals in `.ai/task.md` before making changes
- record notable improvements or follow-up ideas in `.ai/journey`
- an overview of the current package. `.ai/structure.md`
- keep feedback notes in `.ai/subagents` as independent agent reviews
- consult `.ai/structure.md` before entering any planning phase
- component should bu placed in `/src/componetns` 

# instruction 
- before component create, follow the `.ai/tasks.md` first, which job remain or need to planing.
- follow the plan in the #plan in the `.ai/task.md`  file, and Refer to `.ai/structure.md `for an overview of the current package.
- analyze` .ai/content.md` file first then create each content file in `src/conent/` first. 
## compoent creation
- beforec create compoent, you should define domain first for comopent
- refer to file in the `.ai/compoent/` than define current compoent props 
- before create the component, make sure the component already exist in `@ui/shadcn `package in the local monorepo package(which is `/package/ui/shadcn `)
- if appropriate component exist in the `@ui/shadcn` package, please import it from @ui/shadcn directly.
- if not, create the compoent in the `/src/compoentes`,
- compoent should composied with basic elemement component like label, button , input, card and we do not make this element compoent it self
- instead, we use shadcn ui compoent which defined in  `@ui/shadcn` package (`@ui/shadcn/compoennts/ui Folder`)
- so while you made custom compoent, not to create element comopent but import it from @ui/shadcn first, than composited with this element compoenet 
- component include domain type information 
- after crete comopent, add compoent to the `app/page.tsx` and inject content data as props in the  `/src/compoentents/`
- after complete create compoent, write on `.ai/journey.md` than find is remain task in the `.ai/task.md`
- If you believe this component is a highly reusable one that could be used elsewhere, record a note in the **#todo** section of `.ai/task.md` to review this component.
- after complete all the task, create git commit 
